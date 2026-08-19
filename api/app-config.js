export default function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "https://ktjrhytbhrbdcfrpznln.supabase.co",
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_TkZBfuo4KIEC1LykLUE7Dw_eLbBSP1v"
  });
}
