// Videodaki kişiyi arka plandan ayırır (Apple Vision). Her kare için gri tonlu maske (beyaz = kişi) yazar.
// Kullanım: kisi-maske <video> <genislik> <yukseklik> [hizli|dogru]   -> stdout: ham gri kareler (genislik*yukseklik bayt/kare)
// İlk satır olarak stderr'e "KARE <fps> <sayi>" yazar.
import Foundation
import AVFoundation
import Vision
import CoreImage

let a = CommandLine.arguments
guard a.count >= 4, let W = Int(a[2]), let H = Int(a[3]) else { FileHandle.standardError.write("kullanım: kisi-maske video gen yuk [hizli|dogru]\n".data(using: .utf8)!); exit(2) }
let kalite: VNGeneratePersonSegmentationRequest.QualityLevel = (a.count > 4 && a[4] == "hizli") ? .balanced : .accurate
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let sem = DispatchSemaphore(value: 0)
var izler: [AVAssetTrack] = []
Task { izler = (try? await asset.loadTracks(withMediaType: .video)) ?? []; sem.signal() }
sem.wait()
guard let iz = izler.first else { FileHandle.standardError.write("video izi yok\n".data(using: .utf8)!); exit(1) }
let okuyucu = try! AVAssetReader(asset: asset)
let cikis = AVAssetReaderTrackOutput(track: iz, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange])
cikis.alwaysCopiesSampleData = false
okuyucu.add(cikis)
okuyucu.startReading()

let istek = VNGeneratePersonSegmentationRequest()
istek.qualityLevel = kalite
istek.outputPixelFormat = kCVPixelFormatType_OneComponent8
let sira = VNSequenceRequestHandler()
let ci = CIContext(options: [.workingColorSpace: NSNull()])
var tampon = [UInt8](repeating: 0, count: W * H)
let gri = CGColorSpaceCreateDeviceGray()
let out = FileHandle.standardOutput
var n = 0
while let ornek = cikis.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(ornek) else { continue }
  autoreleasepool {
    try? sira.perform([istek], on: pb, orientation: .up)
    if let m = istek.results?.first?.pixelBuffer {
      let img = CIImage(cvPixelBuffer: m)
      let sx = CGFloat(W) / img.extent.width, sy = CGFloat(H) / img.extent.height
      let olc = img.transformed(by: CGAffineTransform(scaleX: sx, y: sy))
      ci.render(olc, toBitmap: &tampon, rowBytes: W, bounds: CGRect(x: 0, y: 0, width: W, height: H), format: .L8, colorSpace: gri)
    } else { for i in 0..<tampon.count { tampon[i] = 0 } }
    out.write(Data(tampon))
  }
  n += 1
}
FileHandle.standardError.write("BITTI \(n)\n".data(using: .utf8)!)
