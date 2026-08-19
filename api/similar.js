export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  res.setHeader("Cache-Control","no-store");
  return res.status(410).json({
    error:"AI soru üretimi kapalı. Benzer sorular yalnız ÖSYM, MEB/OGM ve kayıtlı PDF soru kütüphanesinden seçilir.",
    mode:"library-only"
  });
}
