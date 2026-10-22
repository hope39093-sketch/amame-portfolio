// Supabase 接続設定（公開用キーなので、サイトに入れて大丈夫です）
const SUPABASE_URL="https://kjdnstktmpobooifjeng.supabase.co";
const SUPABASE_KEY="sb_publishable_asgYFq3NYYXvhUaKkRB1fw_9hN-392b";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// サイトのデータを読み込む（失敗しても def の仮データで表示）
async function loadData(def){
  const d=structuredClone(def);
  try{
    const [a,b]=await Promise.all([
      sb.from("site_data").select("data").eq("id",1).single(),
      sb.from("works").select("*").order("sort").order("created_at")
    ]);
    if(a.error||b.error)throw (a.error||b.error);
    Object.assign(d,a.data.data||{});
    if(b.data.length){d.illust=[];d.model=[];b.data.forEach(w=>d[w.type].push({id:w.id,title:w.title,image:w.image_url,category:w.category}));}
  }catch(e){console.error(e);d._err=true;}
  return d;
}
