const Jimp = require('jimp');
const path = require('path');

async function resizePhoto() {
    // Ganti nama file sesuai foto yang mau di-resize
    const inputFile = process.argv[2] || 'foto.png';
    const inputPath = path.resolve(__dirname, 'public/uploads', inputFile);
    const outputPath = path.resolve(__dirname, 'public/uploads', 'pas_foto_432x450.png');

    const targetW = 432;
    const targetH = 450;
    const targetRatio = targetW / targetH;

    console.log(`Membaca foto: ${inputPath}`);
    const img = await Jimp.read(inputPath);

    const imgW = img.getWidth();
    const imgH = img.getHeight();
    console.log(`Ukuran asli: ${imgW} x ${imgH}`);

    // Cover crop: resize lalu crop tengah
    if ((imgW / imgH) > targetRatio) {
        img.resize(Jimp.AUTO, targetH);
        const newW = img.getWidth();
        const cropX = Math.floor((newW - targetW) / 2);
        img.crop(cropX, 0, targetW, targetH);
    } else {
        img.resize(targetW, Jimp.AUTO);
        const newH = img.getHeight();
        const cropY = Math.floor((newH - targetH) / 2);
        img.crop(0, cropY, targetW, targetH);
    }

    console.log(`Ukuran baru: ${img.getWidth()} x ${img.getHeight()}`);
    await img.writeAsync(outputPath);
    console.log(`Tersimpan di: ${outputPath}`);
}

resizePhoto().catch(console.error);
