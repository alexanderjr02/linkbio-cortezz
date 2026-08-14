/* ============================================================
   CORTEZ BARBEARIA · COMPORTAMENTOS
   ------------------------------------------------------------
   1. Loader de abertura
   2. Revelações no scroll (IntersectionObserver)
   3. Carrosséis (dots, setas e arrastar com o mouse)

   Carregado no fim do <body>, sem "defer" e sem módulos ES,
   para que a página continue funcionando ao abrir o index.html
   direto pelo navegador (protocolo file://).
============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  var loader = document.getElementById('loader');
  var aberto = false;
  function endLoader(){
    if(aberto) return;              // chamado pelo 'load' e pelo fallback
    aberto = true;
    document.body.classList.remove('locked');
    startHeroVideo();
    if(reduce){ if(loader) loader.remove(); startReveals(); return; }
    loader.classList.add('done');
    setTimeout(function(){ if(loader) loader.remove(); }, 1100);
    startReveals();
  }
  if(reduce){ endLoader(); }
  else { window.addEventListener('load', function(){ setTimeout(endLoader, 2100); });
         setTimeout(endLoader, 3600); /* fallback caso load demore */ }

  /* ---------- FUNDO EM VÍDEO DO HERO ----------
     O vídeo é enfeite: entra depois do loader, nunca disputa banda com
     as fontes e o primeiro desenho da tela, e desiste sozinho quando
     não vale a pena. Em todos os casos de desistência sobra o poster,
     que já sustenta o hero sozinho. */
  function startHeroVideo(){
    var media = document.querySelector('.hero__media');
    if(!media) return;
    var video = media.querySelector('video');
    var con = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var poupar = !video || reduce ||
      (con && (con.saveData || /^(slow-2g|2g|3g)$/.test(con.effectiveType || '')));

    if(poupar){ media.classList.add('is-live'); return; }

    // só a partir daqui os arquivos entram na fila de download
    Array.prototype.forEach.call(video.querySelectorAll('source[data-src]'), function(s){
      s.src = s.getAttribute('data-src');
      s.removeAttribute('data-src');
    });
    video.load();

    var naTela = true;
    function tocar(){
      var p = video.play();
      // autoplay barrado pelo navegador: assume o poster e segue a vida
      if(p && p.catch) p.catch(function(){ media.classList.add('is-live'); });
    }
    video.addEventListener('playing', function(){ media.classList.add('is-live'); }, {once:true});
    video.addEventListener('error',   function(){ media.classList.add('is-live'); }, {once:true});
    tocar();

    // não gasta bateria nem dados fora da tela ou com a aba escondida
    document.addEventListener('visibilitychange', function(){
      if(document.hidden) video.pause();
      else if(naTela) tocar();
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        naTela = entries[0].isIntersecting;
        if(naTela && !document.hidden) tocar(); else video.pause();
      }, {threshold:0}).observe(media);
    }
  }

  /* ---------- REVELAÇÕES NO SCROLL ---------- */
  function startReveals(){
    var els = document.querySelectorAll('.reveal');
    if(reduce || !('IntersectionObserver' in window)){
      els.forEach(function(e){ e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); });
  }

  /* ---------- CARROSSÉIS ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function(track){
    var key = track.getAttribute('data-carousel');
    var cards = Array.prototype.slice.call(track.children);
    var dotsWrap = document.querySelector('[data-dots="'+key+'"]');
    var prev = document.querySelector('[data-prev="'+key+'"]');
    var next = document.querySelector('[data-next="'+key+'"]');

    // dots
    cards.forEach(function(c, i){
      var b = document.createElement('button');
      b.setAttribute('aria-label','Ir para item '+(i+1));
      b.addEventListener('click', function(){ scrollToCard(i); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollToCard(i){
      var c = cards[i];
      if(!c) return;
      track.scrollTo({left: c.offsetLeft - track.offsetLeft, behavior:'smooth'});
    }
    function current(){
      var center = track.scrollLeft + track.clientWidth/2;
      var best=0, bd=Infinity;
      cards.forEach(function(c,i){
        var cc = c.offsetLeft - track.offsetLeft + c.clientWidth/2;
        var d = Math.abs(cc-center);
        if(d<bd){bd=d;best=i;}
      });
      return best;
    }
    function sync(){
      var i = current();
      dots.forEach(function(d,di){ d.setAttribute('aria-current', di===i ? 'true':'false'); });
    }
    dots[0] && dots[0].setAttribute('aria-current','true');

    var t;
    track.addEventListener('scroll', function(){ clearTimeout(t); t=setTimeout(sync,60); }, {passive:true});
    prev && prev.addEventListener('click', function(){ scrollToCard(Math.max(0,current()-1)); });
    next && next.addEventListener('click', function(){ scrollToCard(Math.min(cards.length-1,current()+1)); });

    // arrastar com o mouse (desktop)
    var down=false, startX=0, startL=0, moved=false;
    track.addEventListener('pointerdown', function(e){
      if(e.pointerType==='mouse'){ down=true; moved=false; startX=e.clientX; startL=track.scrollLeft; track.classList.add('dragging'); }
    });
    window.addEventListener('pointermove', function(e){
      if(!down) return;
      var dx=e.clientX-startX;
      if(Math.abs(dx)>4) moved=true;
      track.scrollLeft = startL - dx;
    });
    window.addEventListener('pointerup', function(){
      if(down){ down=false; track.classList.remove('dragging'); if(moved) scrollToCard(current()); }
    });
    // evita clique acidental ao arrastar
    track.addEventListener('click', function(e){ if(moved){ e.preventDefault(); } }, true);
  });
})();
