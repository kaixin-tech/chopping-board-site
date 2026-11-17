// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function(){
  var t = document.querySelector('.menu-toggle');
  var m = document.querySelector('.mobile-menu');
  if(t && m){
    t.addEventListener('click', function(){ m.classList.toggle('open'); });
    m.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ m.classList.remove('open'); }); });
  }

  // Product gallery thumbnail switching
  document.querySelectorAll('.gallery').forEach(function(g){
    var main = g.querySelector('.main-img img');
    g.querySelectorAll('.thumbs img').forEach(function(th){
      th.addEventListener('click', function(){
        g.querySelectorAll('.thumbs img').forEach(function(x){x.classList.remove('active');});
        th.classList.add('active');
        if(main) main.src = th.src;
      });
    });
  });

  // Inquiry form -> Web3Forms backend (no server needed)
  var form = document.getElementById('inquiry-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = document.getElementById('form-ok');
      var val = function(n){ var el = form.querySelector('[name=' + n + ']'); return el ? el.value.trim() : ''; };
      var name = val('name');
      var contact = val('contact');
      var msg = val('message');
      if(!name || !contact || !msg){
        alert('Please fill in Name / Company, Email or WhatsApp number, and Message.');
        return;
      }
      var key = val('access_key');
      var product = val('product');
      var market = val('market');

      // Fallback: if access_key is not configured, open a pre-filled email
      if(!key || key === 'YOUR_WEB3FORMS_KEY'){
        var subject = 'Chopping Board Inquiry from ' + name;
        var body = 'Name / Company: ' + name + '\nContact: ' + contact +
          '\nProduct: ' + product + '\nMarket: ' + market + '\n\nMessage:\n' + msg;
        if(ok){ ok.textContent = 'Please send the email that just opened to complete your inquiry.'; ok.style.display = 'block'; }
        window.location.href = 'mailto:alina@kaixinkeji.cn?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        return;
      }

      // Send via Web3Forms. "contact" may be an email or a WhatsApp number.
      var isEmail = contact.indexOf('@') > 0;
      var data = {
        access_key: key,
        name: name,
        email: contact,
        contact_type: isEmail ? 'Email' : 'WhatsApp',
        product: product,
        market: market,
        message: msg,
        subject: 'Chopping Board Inquiry from ' + name
      };
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function(r){ return r.json(); })
        .then(function(res){
          if(res.success){
            if(ok){ ok.textContent = 'Thanks! Your inquiry has been sent. We will reply within 24 hours.'; ok.style.display = 'block'; }
            form.reset();
          } else {
            alert('Sorry, submission failed. Please email alina@kaixinkeji.cn or use WhatsApp.');
          }
        }).catch(function(){
          alert('Network error. Please email alina@kaixinkeji.cn or use WhatsApp.');
        });
    });
  }
});
