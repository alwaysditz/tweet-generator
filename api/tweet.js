export default async function handler(req, res) {
  try {
    // Pastikan metode request adalah POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Metode tidak diizinkan' });
      return;
    }

    const { profile, name, username, tweet, retweets, likes } = req.body;

    // Pastikan semua data yang diperlukan ada
    if (!name || !username || !tweet) {
      res.status(400).json({ error: "Data tidak lengkap" });
      return;
    }

    // Bangun URL API eksternal
    const apiUrl = `https://api.siputzx.my.id/api/m/tweet?profile=${encodeURIComponent(profile || '')}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&tweet=${encodeURIComponent(tweet)}&image=null&theme=dark&retweets=${retweets}&quotes=400&likes=${likes}&client=Twitter%20for%20iPhone`;

    // Ambil data dari API
    const response = await fetch(apiUrl);

    if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ error: "Gagal mengambil data dari API eksternal", details: errorText });
        return;
    }

    // Dapatkan data gambar sebagai ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Kirimkan buffer gambar sebagai response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="tweet.png"');
    res.status(200).send(buffer);

  } catch (error) {
    res.status(500).json({ error: "Gagal memproses permintaan", details: error.message });
  }
  }
