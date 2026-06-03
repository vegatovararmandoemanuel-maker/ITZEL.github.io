// Lógica actualizada para renderizar el simulador SPEI en canvas, soportando imágenes de sellos y marca de agua

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-render').addEventListener('click', render);
  document.getElementById('download').addEventListener('click', downloadImage);
  document.getElementById('print').addEventListener('click', printImage);

  // Render inicial
  render();
});

function loadImage(src){
  return new Promise((resolve)=>{
    if(!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = ()=>resolve(img);
    img.onerror = ()=>resolve(null);
    img.src = src;
  });
}

async function render(){
  const canvas = document.getElementById('spei-canvas');
  const ctx = canvas.getContext('2d');
  const ancho = 900, alto = 1200;
  canvas.width = ancho; canvas.height = alto;

  // Read values
  const clave = document.getElementById('clave').value || '';
  const fechaOp = document.getElementById('fechaOp').value || '';
  const monto = document.getElementById('monto').value || '';
  const bancoOrd = document.getElementById('bancoOrd').value || '';
  const bancoBen = document.getElementById('bancoBen').value || '';
  const cuentaBen = document.getElementById('cuentaBen').value || '';
  const concepto = document.getElementById('concepto').value || '';
  const estatus = document.getElementById('estatus').value || '';
  const responsable = document.getElementById('responsable').value || '';
  const desde = document.getElementById('desde').value || '';
  const tiempo = document.getElementById('tiempo').value || '';

  const logoLeftSrc = document.getElementById('logoLeft').value || '';
  const logoRightSrc = document.getElementById('logoRight').value || '';
  const selloHaciendaSrc = document.getElementById('selloHacienda').value || '';

  const watermarkEnable = document.getElementById('watermark_enable').checked;
  const watermarkText = document.getElementById('watermark_text').value || 'SIMULACIÓN - NO VÁLIDO';
  const overlayUrl = document.getElementById('overlay_url').value || '';

  // Clear
  ctx.clearRect(0,0,ancho,alto);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,ancho,alto);

  const m = 40;
  // border
  ctx.strokeStyle = '#e6eefc'; ctx.lineWidth = 2; ctx.strokeRect(m,m,ancho-2*m,alto-2*m);

  // Load images
  const [logoLeft, logoRight, selloHacienda, overlayImg] = await Promise.all([
    loadImage(logoLeftSrc),
    loadImage(logoRightSrc),
    loadImage(selloHaciendaSrc),
    loadImage(overlayUrl)
  ]);

  // Header
  ctx.fillStyle = '#f4f7ff'; ctx.fillRect(m, m, ancho-2*m, 120);
  // draw logos or placeholders
  if(logoLeft){ ctx.drawImage(logoLeft, m+16, m+16, 100, 80); } else { ctx.fillStyle='#e0e6ff'; ctx.fillRect(m+16,m+16,100,80); ctx.fillStyle='#888'; ctx.font='12px Arial'; ctx.fillText('[Logo]', m+30, m+60); }
  if(logoRight){ ctx.drawImage(logoRight, ancho-m-16-140, m+20, 140, 60); } else { ctx.fillStyle='#cfd9ff'; ctx.fillRect(ancho-m-16-140, m+20, 140,60); ctx.fillStyle='#777'; ctx.font='12px Arial'; ctx.fillText('[Logo]', ancho-m-16-140 + 40, m+50); }

  ctx.fillStyle = '#111'; ctx.font = 'bold 20px Arial'; ctx.fillText('Rastreo de Transferencia SPEI', m+140, m+40);
  ctx.font = '14px Arial'; ctx.fillText('Consulta el estatus de tu transferencia SPEI', m+140, m+66);
  const consultaNow = new Date();
  ctx.fillStyle = '#555'; ctx.font = '12px Arial'; ctx.fillText('Fecha y hora de consulta: ' + consultaNow.toLocaleDateString('es-ES') + ' - ' + consultaNow.toLocaleTimeString('es-ES'), m+140, m+92);

  // DETALLES
  let y = m + 160;
  ctx.fillStyle = '#0b3d91'; ctx.font = 'bold 16px Arial'; ctx.fillText('DETALLES DE LA OPERACIÓN', m+16, y);
  y += 28;
  ctx.fillStyle = '#000'; ctx.font = '14px Arial';

  writeLabelValue(ctx, 'Clave de rastreo SPEI', clave, m+16, y); y += 28;
  writeLabelValue(ctx, 'Fecha y hora de operación', fechaOp, m+16, y); y += 28;
  writeLabelValue(ctx, 'Monto', monto, m+16, y); y += 28;
  writeLabelValue(ctx, 'Moneda', 'MXN', m+16, y); y += 28;
  writeLabelValue(ctx, 'Tipo de operación', 'Transferencia electrónica', m+16, y); y += 28;
  writeLabelValue(ctx, 'Banco ordenante', bancoOrd, m+16, y); y += 28;
  writeLabelValue(ctx, 'Banco beneficiario', bancoBen, m+16, y); y += 28;
  writeLabelValue(ctx, 'Cuenta beneficiaria', cuentaBen, m+16, y); y += 28;
  writeLabelValue(ctx, 'Concepto', concepto, m+16, y); y += 36;

  // ESTATUS
  ctx.fillStyle = '#0b3d91'; ctx.font = 'bold 16px Arial'; ctx.fillText('ESTATUS DE LA OPERACIÓN', m+16, y); y += 22;
  ctx.fillStyle = '#000'; ctx.font = '14px Arial';
  wrapText(ctx, estatus, m+18, y, ancho-2*m-36, 18); y += 72;

  // HACIENDA BOX
  const boxH = 140;
  ctx.fillStyle = '#f6f9ff'; ctx.fillRect(m+18, y, ancho-2*m-36, boxH);
  ctx.fillStyle = '#111'; ctx.font = 'bold 14px Arial'; ctx.fillText('HACIENDA', m+30, y+22);
  ctx.font = '12px Arial';
  const bodyText = 'SECRETARÍA DE HACIENDA Y CRÉDITO PÚBLICO\\nLa operación está siendo revisada por el Servicio de Administración Tributaria (SAT) conforme al artículo 31 del Código Fiscal de la Federación y disposiciones aplicables.';
  wrapText(ctx, bodyText, m+30, y+44, ancho-2*m-72, 16);

  // optionally draw sello hacienda inside box
  if(selloHacienda){
    const sx = ancho - m - 140; const sy = y + 10; ctx.drawImage(selloHacienda, sx-40, sy, 120, 120);
  }
  y += boxH + 16;

  // LÍNEA DE TIEMPO
  ctx.fillStyle = '#0b3d91'; ctx.font = 'bold 16px Arial'; ctx.fillText('LÍNEA DE TIEMPO', m+16, y); y += 24;
  ctx.fillStyle = '#000'; ctx.font = '14px Arial';
  const timeline = '19/05/2026 10:23:15 h - Operación recibida por Scotiabank\\n19/05/2026 10:23:20 h - Enviada al SPEI para su procesamiento\\n19/05/2026 10:23:35 h - En Cámara de Compensación de Hacienda - Revisión en proceso\\nPendiente - Acreditación al banco beneficiario';
  wrapText(ctx, timeline, m+18, y, ancho-2*m-36, 18); y += 120;

  // RESPONSABLE ACTUAL
  ctx.fillStyle = '#0b3d91'; ctx.font = 'bold 16px Arial'; ctx.fillText('RESPONSABLE ACTUAL', m+16, y); y += 24;
  ctx.fillStyle = '#000'; ctx.font = 'bold 14px Arial'; ctx.fillText(responsable, m+18, y); y += 20;
  ctx.fillStyle = '#000'; ctx.font = '14px Arial'; ctx.fillText('Desde: ' + desde, m+18, y); y += 20;
  ctx.fillText('Tiempo transcurrido: ' + tiempo, m+18, y);

  // Footer notes
  ctx.fillStyle = '#666'; ctx.font = '11px Arial'; ctx.textAlign = 'center'; ctx.fillText('Conexión segura — SPEI — IPAB. Esta operación está sujeta a la regulación de Banxico, las reglas del SPEI y disposiciones fiscales aplicables.', ancho/2, alto-30);

  // Overlay image (user-provided)
  if(overlayImg){
    const ow = 160; const oh = (overlayImg.height/overlayImg.width)*ow; ctx.drawImage(overlayImg, ancho- m - ow, alto - m - oh - 40, ow, oh);
  }

  // Watermark
  if(watermarkEnable){
    ctx.save();
    ctx.globalAlpha = 0.08; ctx.fillStyle = '#000'; ctx.font = 'bold 72px Arial';
    ctx.translate(ancho/2, alto/2); ctx.rotate(-0.4); ctx.textAlign = 'center';
    ctx.fillText(watermarkText, 0, 0);
    ctx.restore();
  }
}

function writeLabelValue(ctx, label, value, x, y){
  ctx.fillStyle = '#333'; ctx.font = 'bold 12px Arial'; ctx.fillText(label, x, y);
  ctx.fillStyle = '#000'; ctx.font = '14px Arial'; ctx.fillText(': ' + value, x+220, y);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const lines = text.split('\n');
  for(let i=0;i<lines.length;i++){
    let words = lines[i].split(' ');
    let line = '';
    for(let n=0;n<words.length;n++){
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if(metrics.width > maxWidth && n>0){
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
}

function downloadImage(){
  const canvas = document.getElementById('spei-canvas');
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'SPEI_simulation_' + Date.now() + '.png';
  link.click();
}

function printImage(){
  const canvas = document.getElementById('spei-canvas');
  const url = canvas.toDataURL('image/png');
  const win = window.open('');
  win.document.write('<html><head><title>Imprimir</title></head><body style="margin:0;"><img src="'+url+'" style="width:100%;height:auto;"/></body></html>');
  win.document.close();
  win.focus();
  setTimeout(()=>{ win.print(); }, 500);
}
