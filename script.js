"use strict";
document.documentElement.classList.add('js-ready');
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
function setMenu(open){
  nav.classList.toggle('open',open);
  document.body.classList.toggle('menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  menuButton.querySelector('.menu-open-icon').hidden=open;
  menuButton.querySelector('.menu-close-icon').hidden=!open;
}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){setMenu(false);menuButton.focus()}});
window.addEventListener('resize',()=>{if(window.innerWidth>900)setMenu(false)});
// Basic active section tracking for keyboard and visual navigation.
if('IntersectionObserver' in window){
  const links=[...nav.querySelectorAll('a[href^="#"]')];
  const sections=links.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){if(entry.isIntersecting){for(const a of links){const active=a.getAttribute('href')==='#'+entry.target.id;a.classList.toggle('nav-link-active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}}}
  },{rootMargin:'-20% 0px -66% 0px',threshold:0});
  sections.forEach(s=>observer.observe(s));
}
const contactForm=document.getElementById('contact-form');
const errorElement=document.getElementById('form-error');
const successElement=document.getElementById('form-success');
const inputs=[...contactForm.querySelectorAll('input[required],textarea[required]')];
function resetErrors(){errorElement.hidden=true;successElement.hidden=true;inputs.forEach(i=>i.removeAttribute('aria-invalid'))}
contactForm.addEventListener('input',resetErrors);
contactForm.addEventListener('submit',e=>{
  e.preventDefault();resetErrors();
  const data=new FormData(contactForm);
  const required=['name','hospital','email','phone','state','country','query'];
  const missing=required.find(k=>!String(data.get(k)||'').trim());
  const email=String(data.get('email')||'').trim();
  const phone=String(data.get('phone')||'').trim();
  let bad=missing,message='Please complete all required fields.';
  if(!bad&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){bad='email';message='Please enter a valid email address.'}
  if(!bad&&!/^[0-9 +()\-]{6,20}$/.test(phone)){bad='phone';message='Please enter a valid contact number.'}
  if(bad){let field=contactForm.elements.namedItem(bad);field?.setAttribute('aria-invalid','true');errorElement.textContent=message;errorElement.hidden=false;field?.focus();return}
  const subject='Skitii collaboration enquiry — '+data.get('hospital');
  const body=['Full name: '+data.get('name'),'Hospital: '+data.get('hospital'),'Email: '+email,'Phone: '+data.get('code')+' '+phone,'State: '+data.get('state'),'Country: '+data.get('country'),'','Enquiry:',data.get('query')].join('\n');
  const link='mailto:hello@skitii.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  successElement.textContent='Your email application should open with a pre-filled enquiry. Please send the email to complete your request.';
  successElement.hidden=false;
  window.location.href=link;
});
document.getElementById('year').textContent=new Date().getFullYear();
