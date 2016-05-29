import { PIs } from '/imports/api/collections/pis.js'; // Personal Inventory collections

import  shortid  from 'shortid';

Meteor.startup(() => {
  if (PIs.find().count() === 0) {
    const ifadeler = [
      {
        scale: "BAŞARMA ÇABASI",
        phrases: [
          "Sorumluluk almayı severim.",
          "Hedefime ulaşmak için çok çalışırım.",
          "Her şey mükemmel olana kadar işime devam ederim.",
          "İşlerin yönetimi benden sorulur.",
          "Asla yaptığım işten vazgeçmem.",
          "İşlerimi tamamlamak için tüm gücümle çalışırım.",
          "Benden beklenilenden daha fazlasını yaparım.",
          "Başarmak için yeterince motive olmuş değilim."
        ]
      },
      {
        scale: "UYUM",
        phrases: [
          "İnsanların hakkımda ne düşündükleri konusunda endişeliyimdir.",
          "Başkalarının onayına ihtiyaç duyarım.",
          "Başkalarının ne düşündüğü beni ilgilendirmez.",
          "Başkaları üzerinde iyi bir imaj sergilemekle ilgilenirim.",
          "Başkaları beni sevmiyorsa bu benim için hiç sorun olmaz."
        ]
      },
      {
        scale: "UYUMLULUK / ESNEKLİK",
        phrases: [
          "Tavsiye almada ve diğer insanların sözünü dinlemede iyiyimdir.",
          "Yeni durumlara kolaylıkla uyum sağlarım.",
          "İşimle ilgili eleştirileri tolere edebilirim.",
          "Herkesle aynı fikirdeyimdir.",
          "Diğerlerinin iyi niyeti olduğuna inanırım.",
          "Diğer insanlara karşı saygılıyımdır.",
          "İnsanları oldukları gibi kabul ederim.",
          "Diğer insanları önemserim.",
          "İnsanların söylediklerine inanırım.",
          "Diğer insanların hislerini paylaşırım.",
          "Tüm insanlara eşit davranırım.",
          "Karşı çıkılan biri olmaya katlanamam."
        ]
      },
      {
        scale: "VİCDANLILIK",
        phrases: [
          "İşten kaytarırım.",
          "İşe başlayıp, devam ettirmek benim için zordur.",
          "Sadece benden beklenilen kadarını yaparım.",
          "İşlerin sonunu getiremem.",
          "Hoşuma gitmeyen işleri sona ertelerim.",
          "Çoğu zaman işe geç kalırım.",
          "Kendimi başkaları için feda ederim.",
        ]
      },
      {
        scale: "KAYGI",
        phrases: [
          "Çoğu zaman gergin ve asabiyimdir.",
          "Hemen panik olurum.",
          "Endişem ve kaygım kontrol edilemez bir şekildedir.",
          "Herhangi bir şeyi  yanlış yapmaktan dolayı kaygılanırım.",
          "Geçmiş hatalarımı düşünerek zamanımı harcarım.",
          "'Hayır' sözcüğünü kullanırken suçlu hissederim.",
        ]
      },
      {
        scale: "GÜVENİLİRLİK",
        phrases: [
          "Herhangi bir işte otomatik olarak sorumluluğu üstüme almaya eğilimliyimdir.",
          "Kendi kendimi ilerletmeye çalışırım.",
          "Planlarımı, faaliyete dönüştürürüm.",
          "Anında çözüm yolu öneririm.",
          "Diğer insanlara liderlik etmeye çalışırım.",
          "Diğer insanları iş konusunda çaba göstermeleri için ikna ederim.",
          "Sır tutma konusunda güvenilir biriyimdir.",
          "Verdiğim sözü tutarım.",
          "Güvenmek için dürüstlüğün temel olduğuna inanırım.",
          "Kendi değerlerime sadık birisiyimdir.",
          "Başkalarının benim yerime karar vermesine izin veririm.",
        ]
      },
      {
        scale: "DİKKATLİLİK",
        phrases: [
          "Genellikle son dakika planları yaparım.",
          "Düşüncesiz kişileri sevmem.",
          "Gücümün yettiğinden fazlasını harcamam.",
          "Bir hevesle olaylara düşünmeden atlarım.",
        ]
      },
      {
        scale: "BİLİŞSEL SORUNLAR",
        phrases: [
          "Genellikle fikirlerimin bir anlamı olmadığını düşünürüm.",
          "Sıklıkla dağınık, düzensiz düşüncelerim olur.",
          "Kafam çabuk karışır ve düşünce zincirimi çabucak kaybederim.",
          "Gün boyunca yaptığım işleri aklımda tutabileceğim iyi bir hafızam vardır.",
          "Karar vermek için sorumluluk almayı severim.",
          "Baskı altındayken sakin kalırım.",
        ]
      },
      {
        scale: "TAKIM ÇALIŞMASI",
        phrases: [
          "Grup toplantılarını veya takım çalışmalarını kaçırmam.",
          "Bir grubun parçası olmaktan hoşlanırım.",
          "Takım arkadaşlarımı desteklerim.",
          "Grup içinde çalışmada iyi değilimdir.",
          "Genellikle yalnız çalışmayı tercih ederim.",
          "Başkalarıyla sosyal ilişkiler kurmanın önemli olmadığını düşünüyorum.",
        ]
      },
      {
        scale: "İŞBİRLİĞİ – ortaklaşa çalışma",
        phrases: [
          "Yarıştan çok işbirliğine değer veririm.",
          "Amacımı başkalarına aşılarım.",
          "Rekabeti severim.",
          "Pervasız olmaktan hoşlanırım.",
        ]
      },
      {
        scale: "YARATICILIK",
        phrases: [
          "Karmaşık problemlerle uğraşmaktan çekinirim.",
          "Kimsenin sormadığı soruları sormayı severim.",
          "Pek çok sorunun cevabını bilirim.",
          "Bir şey yaparken yeni yollar düşünmeyi severim.",
          "Durumlar arasında kolayca bağlantı kurarım.",
          "Parlak bir hayal gücüm vardır.",
          "Yeni ve farklı fikirler geliştirebilirim.",
        ]
      },
      {
        scale: "GAYRET ÇABA ÖZEN",
        phrases: [
          "Başarmak için kendimi motive ederim.",
          "Bir iş yapmaya çabucak başlarım.",
          "Kendimi iş yapma konusunda zorlarım.",
          "Çok çalışmayı önemli sayarım.",
          "Görevleri başarıyla tamamlarım.",
          "İş zor gelirse dururum.",
        ]
      },
      {
        scale: "SORUMLULUĞUNU BİLME(SORUMLULUK)",
        phrases: [
          "Talimatlara uygun davranırım.",
          "İşimde doğru ve dürüst davranırım.",
          "Kurallara sadık biriyimdir.",
          "Kuralları önemsemem.",
        ]
      },
      {
        scale: "VERİMLİLİK",
        phrases: [
          "İşimi titizlikle yaparım.",
          "Günlük işlerimi genellikle yaparım.",
          "Planlarıma göre hareket ederim.",
          "Başladığım işi bitiririm.",
        ]
      },
      {
        scale: "(DUYGUSAL ZEKA)",
        phrases: [
          "Herhangi bir duruma uyum sağlarım.",
          "Yeni tanıştığım insanlarla iyi anlaşırım.",
          "Başkalarının hislerini algılamada iyiyimdir.",
          "İnsanların kendilerini iyi hissetmesi için söyleyeceklerimi bilirim.",
          "Yeni bir durumla nasıl başa çıkabileceğimi bilemem.",
        ]
      },
      {
        scale: "DUYGUSAL KARARLILIK",
        phrases: [
          "Çoğu kez rahatımdır.",
          "Nadiren canım sıkılır.",
          "Çabucak stres olurum.",
          "Bir şeyler karşısında sürekli endişelenirim.",
          "Çabucak rahatsız olurum.",
          "Ruh halim çok sık değişir.",
          "Sıklıkla duygu geçişleri yaşarım.",
          "Çabucak öfkelenirim.",
          "Genelde canım sıkkındır.",
        ]
      },
      {
        scale: "EMPATİ",
        phrases: [
          "Başkalarının ihtiyaçlarını önceden tahmin edip ona göre davranırım.",
          "Başkalarının isteklerini anlarım.",
          "Bir şeyler hakkında derinlemesine düşünmeyi severim.",
          "Başkalarıyla ilgileniyormuş gibi görünürüm.",
          "Yumuşak tarafım yoktur.",
          "İnsanları kendimden aşağıda görürüm.",
          "Duygularımla bağlantı halinde değilimdir.",
        ]
      },
      {
        scale: "DIŞA DÖNÜKLÜK / İÇE DÖNÜKLÜK",
        phrases: [
          "Etrafımdaki insanlarla rahat hissederim.",
          "Kolayca arkadaş edinirim.",
          "Neşe saçan biriyimdir.",
          "İnsanların gönlünü almayı bilirim.",
          "Arka planda kalırım.",
          "Deneyimlerimi oldukça cansız bir şekilde açıklarım.",
          "Dikkatleri üzerime çekmeyi sevmem.",
          "Çok konuşmayı sevmem.",
          "Yabancıların çevresindeyken sessizimdir.",
          "Başkalarına yanaşmak benim için zordur.",
          "Tanımadığım insanlar arasında bulunmaktan genellikle rahatsız hissederim.",
          "Duygularımı dışa vurmam.",
          "Çok özel biriyimdir.",
          "Başkalarının işe liderlik etmesini beklerim.",
        ]
      },
      {
        scale: "(İYİMSERLİK)",
        phrases: [
          "Canım bir şeylere kolayca sıkılmaz.",
          "İşimden hoşlanırım.",
          "Sakinliğimi korurum.",
          "Asla umudumu yitirmem.",
          "Yaşamı seviyorum.",
          "Çabuk darılırım.",
          "Olabilecek en kötü şeyi düşünürüm.",
          "Sorunlarımın içinde kaybolurum.",
          "Hayatımda yönlendirmeye ihtiyacım olduğunu düşünürüm.",
        ]
      },
      {
        scale: "(BAĞIMSIZLIK)",
        phrases: [
          "Başkalarının ne düşündüğü ile ilgilenmem.",
          "Hoş giyinmeye özen göstermem.",
          "Sevilmek isterim.",
          "Dış görünüşün önemli olduğuna inanırım.",
          "Her konuda destek ararım.",
        ]
      },
      {
        scale: "(ENTELEKTÜEL ZEKA)",
        phrases: [
          "Kendimi geliştirici şeyleri okumayı severim.",
          "Politik tartışmaları ilginç bulurum.",
          "Pek çok şeye ilgim vardır.",
          "Yeni şeyler öğrenmeyi severim.",
          "iş hakkında bilgimi artırmak isterim.",
          "Bir konuyu sorular sorarak derinlemesine irdelemem.",
        ]
      },
      {
        scale: "İÇE DÖNÜKLÜK",
        phrases: [
          "Dikkatleri üzerime çekmeyi sevmem.",
          "Arka planda kalırım.",
          "İlgi odağı olmayı sevmem.",
          "Çok fazla konuşmayı sevmem.",
          "Yalnız başıma olmayı isterim.",
          "Sessizliği ararım.",
          "Yalnız başıma yemekten hoşlanmam.",
          "Sessizlikten hoşlanırım.",
        ]
      },
      {
        scale: "LİDERLİK",
        phrases: [
          "Yönetmeyi seçerim.",
          "Bir şeyi ilk yapan ben olurum.",
          "Söyleyecek söz bulamadığım durum hiç olmaz.",
          "Herhangi bir işte öncülük etmeyi severim.",
          "Dikkatleri üzerime çekmekten korkarım.",
          "Başkalarının karar vermesine izin veririm.",
          "Başkalarını idare etmek benim için kolaydır.",
          "İnsanları etkileme konusunda doğal bir yeteneğim vardır.",
          "İnsanları etkileme konusunda yeteneğim azdır.",
        ]
      },
      {
        scale: "(AHLAKLILIK / ERDEM)",
        phrases: [
          "Vicdanımı dinlerim.",
          "Vicdanıma göre hareket ederim.",
          "Kasiyer hata yaparsa fazla para üstünü geri veririm.",
          "Yaptıklarımın arkasında dururum.",
          "Adalete önem veririm.",
          "Başkalarının mahremiyetine saygı duyarım.",
          "Hayatımdaki uyumu severim.",
          "Kurallara uymaya çalışırım.",
          "Kuralları önemsemem.",
          "Başarılarımı abartırım.",
          "Otoriteye saygı duyarım.",
          "İyi niyetle söylenen yalanın mubah olduğuna inanırım.",
        ]
      },
      {
        scale: "DUYGUSAL DENGESİZLİK",
        phrases: [
          "Genellikle canım sıkılır.",
          "Kendimi sevmiyorum.",
          "Genellikle melankolik bir haldeyimdir.",
          "Sıklıkla duygu geçişleri yaşarım.",
          "Kolayca paniklerim.",
          "Nadiren kızarım.",
          "Nadiren canım sıkılır.",
          "Kolaylıkla canım bir şeylere sıkılmaz.",
          "Kendimle barışığım.",
        ]
      },
      {
        scale: "AÇIK FİKİRLİLİK",
        phrases: [
          "Davranışlarımın nedenlerini tanımlamaya çalışırım.",
          "Tüm durumları ele aldıktan sonra karar veririm.",
          "Objektifliğim konusunda diğer insanlar bana değer verirler.",
          "Bir olayı tüm yönleriyle ele alırım.",
          "Sağduyum konusunda arkadaşlarım bana değer verirler.",
          "Karar verirken farklı olasılıkları düşünmem.",
          "Bir şeyleri eleştirel düşünmeye eğilimli biri değilimdir.",
        ]
      },
      {
        scale: "DENEYİMLERE AÇIKLILIK",
        phrases: [
          "Canlı bir hayal gücüm vardır.",
          "Yeni fikirler duymaktan hoşlanırım.",
          "Soyut fikirlerle ilgili değilimdir.",
          "Felsefi tartışmalardan kaçınırım.",
        ]
      },
      {
        scale: "(MÜKEMMELİYETÇİLİK)",
        phrases: [
          "Her şey çok iyi olana kadar devam ederim.",
          "Her detaya özen gösterilmesini isterim.",
          "Her şeyin tam tamına olmasını isterim.",
          "İşlerin plana göre yürütülmesini isterim.",
          "Başkaları için de en iyiyi isterim.",
          "Başkalarının işlerini dikkatle takip ederim.",
          "Başkalarının da işiyle ilgili özel çalışmasını beklerim.",
          "Dağınık kişilerden rahatsız olmam.",
          "Düzensizlik beni rahatsız etmez.",
        ]
      },
      {
        scale: "(BİLİNÇ/ KENDİNİN FARKINDA OLMA)",
        phrases: [
          "Yanlış şeyi yapmaktan korkarım.",
          "Başkalarına yanaşmak benim için zordur.",
          "Dikkatleri üzerime çekmekten korkarım.",
          "Sadece arkadaşlarımın yanında rahat hissederim.",
          "Kolaylıkla duygularımdan etkilenmem.",
          "Asla sahip olduğumdan daha fazlasını harcamam.",
        ]
      },
      {
        scale: "RİSK ALMA / RİSKTEN KAÇINMA",
        phrases: [
          "Asla yüksek risk taşıyan yatırım yapmam.",
          "Tehlikeli durumlardan kaçınırım.",
          "Macera ararım.",
          "Risk alırım.",
          "Adrenalin patlaması yaşayabilmek için herşey yaparım.",
          "Risk almaktan çok güvende olmayı tercih ederim.",
        ]
      },
      {
        scale: "(ÖZ YETERLİLİK)",
        phrases: [
          "Görevleri başarıyla tamamlarım.",
          "Yaptığım işte en üst düzeye çıkarım.",
          "Görevleri sorunsuzca hallederim.",
          "işe uygun çözümleri bulurum.",
          "İşleri nasıl başaracağımı bilirim.",
          "Bir şeyleri anlamam oldukça vakit alır.",
          "Bir şeylerin sonuçlarını hemen göremem.",
        ]
      },
      {
        scale: "TOLERANS",
        phrases: [
          "Başkalarının önerilerini eleştiririm.",
          "Değişikliğe açık biriyimdir.",
          "Tüm insanların eşit olduğuna inanırım.",
          "Diğer insanları, farklı şekilde düşünenler olarak algılarım.",
          "Affetmeye ve unutmaya çalışırım.",
          "Diğer insanların hatalarından rahatsız olurum.",
          "Birini affetmek benim için zordur.",
          "Değişiklik fikrini sevmem.",
          "Her şeyde mantıksal bir yanıtın olmasına inanırım.",
        ]
      },
      {
        scale: "SAKİNLİK",
        phrases: [
          "Nadiren duygusallaşırım.",
          "Kolaylıkla duygularımdan etkilenmem.",
          "Aşırı duygusalımdır, bu nedenle duygularım altında ezilip kalırım.",
          "Kolayca ağlarım.",
        ]
      },
      {
        scale: "MERAK",
        phrases: [
          "Başka kültürler ve ülkeler hakkında haberdar olmayı severim.",
          "Herhangi bir durumda ilginç bir şeyler bulurum.",
          "Her zaman ilginç bir şeylerle meşgulümdür.",
          "Pek çok farklı aktivite ile uğraşırken heyecanlanırım.",
          "iş hakkında çok meraklı değilimdir.",
        ]
      },
      {
        scale: "DUYGUSAL TABANLI KARAR VERME",
        phrases: [
          "Önemli kararlar alırken hislerimi dinlerim.",
          "Yaşamımdaki hedefleri mantıktan çok duygularıma göre temellendiririm.",
          "Karar verirken aklımdan çok kalbimi dinlerim.",
          "Önemli kararların mantıksal nedenlere dayandırılması gerektiğine inanırım.",
        ]
      },
      {
        scale: "RASYONELLİK",
        phrases: [
          "Olmam gerekenden daha az sıkı ve katıyımdır.",
          "İşlerimi yarım yamalak yaparım.",
          "Suçluları cezalandırmaktan çok yardıma ihtiyacı olduklarını düşünürüm.",
        ]
      },

    ];

    ifadeler.forEach(function(ifade) {
      ifade['slug'] = ifade.scale.toLowerCase().replace('ı','i').replace('ç','c').replace('ğ','g').replace('ö','o').replace('ş','s').replace('ü','u').replace('/','').replace('  ', ' ').replace(/ +/g,'-');
      const pi_id = PIs.insert(ifade);
    });
    console.log("PIs are added");

  }

});
