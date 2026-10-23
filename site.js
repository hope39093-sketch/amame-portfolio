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
  d.flow=(d.flow||[]).map(x=>Array.isArray(x)?x:[x,""]);
  if(!Array.isArray(d.terms))d.terms=String(d.terms||"").split(/^(?=【)/m).filter(x=>x.trim()).map(x=>{const m=x.match(/^【(.*?)】\s*([\s\S]*)$/);return m?[m[1],m[2].trim()]:["規約",x.trim()]});
  ["movies","story","soul"].forEach(k=>d[k]=(d[k]||[]).map(x=>[x[0],x[1],x[2]||"",x[3]||""]));
  return d;
}
// カード表示（x = [タイトル, 説明, 画像URL, 動画URL]）。動画があれば動画、なければ画像を表示
function media(x){const v=x[3]||"",y=v.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  if(y)return `<div style="aspect-ratio:16/9"><iframe src="https://www.youtube-nocookie.com/embed/${y[1]}" allowfullscreen loading="lazy" style="width:100%;height:100%;border:0;border-radius:12px"></iframe></div>`;
  if(v)return `<video src="${esc(v)}" poster="${esc(x[2])}" controls playsinline loop muted style="width:100%;border-radius:12px;background:#000"></video>`;
  return x[2]?`<img src="${esc(x[2])}" alt="" style="width:100%;border-radius:12px;display:block">`:""}
function cards(a){return a.map(x=>`<article style="border:1px solid #eee6eb;border-radius:14px;background:#fff;padding:16px;margin-bottom:16px">${media(x)}<b style="font-weight:500;display:block;margin-top:12px">${esc(x[0])}</b><p style="margin:5px 0 0;color:#a79da8;font-size:13px;line-height:1.8;white-space:pre-wrap">${esc(x[1])}</p></article>`).join("")}
