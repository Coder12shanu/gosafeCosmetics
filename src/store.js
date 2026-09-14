const KEY='gosafe-cosmetics-v1';
const defaults={
  settings:{companyName:'GOSAFE COSMETICS',tagline:'Global Cosmetics Supply, Built on Trust',phone:'+971 58 539 4030',whatsapp:'+971585394030',email:'info@gosafecosmetics.com',website:'www.gosafecosmetics.com',address:'Dubai, UAE',workingHours:'Mon - Sat | 8:00 AM - 8:00 PM',logo:'',favicon:''},
  products:[
    {id:'p1',name:'Hydrating Face Serum',code:'GC-001',brand:'',subcategory:'',category:'Skincare',
      image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      images:[],description:'Lightweight daily serum formulated for a fresh, hydrated skin feel.',
      specifications:'30 ml | Daily skincare | Retail & wholesale supply',
      trending:true,featured:true,offer:false},
    {id:'p2',name:'Nourishing Hair Oil',code:'GC-002',brand:'',subcategory:'',category:'Hair Care',
      image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
      images:[],description:'Premium hair oil for routine nourishment and shine.',
      specifications:'100 ml | Hair care | Bulk enquiries welcome',trending:true,
      featured:false,offer:true},
    {id:'p3',name:'Velvet Matte Lip Color',code:'GC-003',brand:'',subcategory:'Lipstick',category:'Makeup',
      image:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
      images:[],description:'Long-wear matte lip color with a refined finish.',
      specifications:'Multiple shades | Makeup | Wholesale supply',trending:true,
      featured:true,offer:false}
  ],
  categories:['Skincare','Hair Care','Makeup','Personal Care','Fragrances','Beauty Accessories'],
  subcategories:{
    Makeup:['Blush','Bronzers','Colour Correctors','Concealer','Contouring','Face Powders','Foundation','Highlight','Primers','Setting Sprays','Brows','Eye Liner','Eye Primer','Eyelash Glue','Eyeshadow','False Eyelashes','Lash & Brow Serum','Mascara','Lip Gloss','Lip Liner & Pencils','Lip Oil','Lip Plumper','Lip Stain & Tints','Lipstick','Concealer Brushes','Eye Brushes','Eyelash Curlers','False Nails','Foundation Brushes','Makeup Bags','Makeup Brushes','Makeup Sponges']
  },
  offers:[{id:'o1',title:'Special Wholesale Offer',description:'Ask our team for current bulk pricing and availability.',image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',active:true,productId:'p2'}],
  jobs:[],messages:[],applications:[]
};
export function load(){
  try {
    const stored=JSON.parse(localStorage.getItem(KEY)||'{}');
    return {...defaults,...stored,subcategories:stored.subcategories||defaults.subcategories};
  } catch { return defaults }
}
export function save(data){
  localStorage.setItem(KEY,JSON.stringify(data));
  window.dispatchEvent(new Event('gosafe-data-change'));
  fetch('/api/data',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(()=>{});
}
export async function sync(){
  const response=await fetch('/api/data');
  if(!response.ok)throw new Error('Unable to load remote data');
  const result=await response.json();
  if(result.data){
    const data={...defaults,...result.data,subcategories:result.data.subcategories||defaults.subcategories};
    localStorage.setItem(KEY,JSON.stringify(data));
    window.dispatchEvent(new Event('gosafe-data-change'));
    return data;
  }
  const data=load();
  save(data);
  return data;
}
export function reset(){localStorage.removeItem(KEY);location.reload()}
export {KEY,defaults}
