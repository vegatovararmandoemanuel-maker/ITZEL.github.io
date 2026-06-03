document.addEventListener('DOMContentLoaded', function() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = hoy;
    generarDocumento();
    
    document.getElementById('banco').addEventListener('input', generarDocumento);
    document.getElementById('cuenta').addEventListener('input', generarDocumento);
    document.getElementById('titular').addEventListener('input', generarDocumento);
    document.getElementById('monto').addEventListener('input', generarDocumento);
    document.getElementById('moneda').addEventListener('change', generarDocumento);
    document.getElementById('fecha').addEventListener('change', generarDocumento);
    document.getElementById('concepto').addEventListener('input', generarDocumento);
    document.getElementById('referencia').addEventListener('input', generarDocumento);
});

function generarDocumento() {
    const canvas = document.getElementById('documento-canvas');
    const ctx = canvas.getContext('2d');
    
    const banco = document.getElementById('banco').value || 'Banco';
    const cuenta = document.getElementById('cuenta').value || '0000000000';
    const titular = document.getElementById('titular').value || 'Cliente';
    const monto = parseFloat(document.getElementById('monto').value) || 0;
    const moneda = document.getElementById('moneda').value || '$';
    const fecha = document.getElementById('fecha').value || new Date().toISOString().split('T')[0];
    const concepto = document.getElementById('concepto').value || 'Transacción';
    const referencia = document.getElementById('referencia').value || 'REF-0000';
    
    const ancho = 800;
    const alto = 1000;
    canvas.width = ancho;
    canvas.height = alto;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, ancho, alto);
    
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, ancho - 40, alto - 40);
    
    ctx.fillStyle = '#667eea';
    ctx.fillRect(20, 20, ancho - 40, 100);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('COMPROBANTE BANCARIO', ancho / 2, 85);
    
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 140);
    ctx.lineTo(ancho - 40, 140);
    ctx.stroke();
    
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    let posY = 180;
    const espacioLinea = 50;
    
    dibujarSeccion(ctx, 'INFORMACIÓN DEL BANCO', 60, posY, ancho);
    posY += 60;
    
    dibujarCampo(ctx, 'Banco:', banco, 80, posY, ancho);
    posY += espacioLinea;
    
    dibujarCampo(ctx, 'Número de Cuenta:', cuenta, 80, posY, ancho);
    posY += espacioLinea;
    
    dibujarCampo(ctx, 'Titular:', titular, 80, posY, ancho);
    posY += espacioLinea;
    
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, posY - 15);
    ctx.lineTo(ancho - 60, posY - 15);
    ctx.stroke();
    
    posY += 20;
    dibujarSeccion(ctx, 'DETALLES DE LA TRANSACCIÓN', 60, posY, ancho);
    posY += 60;
    
    dibujarCampo(ctx, 'Concepto:', concepto, 80, posY, ancho);
    posY += espacioLinea;
    
    dibujarCampo(ctx, 'Monto:', moneda + ' ' + monto.toFixed(2), 80, posY, ancho);
    posY += espacioLinea;
    
    dibujarCampo(ctx, 'Fecha:', formatearFecha(fecha), 80, posY, ancho);
    posY += espacioLinea;
    
    dibujarCampo(ctx, 'Referencia:', referencia, 80, posY, ancho);
    posY += espacioLinea;
    
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, posY - 15);
    ctx.lineTo(ancho - 60, posY - 15);
    ctx.stroke();
    
    posY += 40;
    dibujarSeccion(ctx, 'INFORMACIÓN ADICIONAL', 60, posY, ancho);
    posY += 60;
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    const texto = 'Este es un documento con formato educativo e informativo.';
    const texto2 = 'Generado el: ' + new Date().toLocaleDateString('es-ES');
    
    ctx.fillText(texto, 80, posY);
    ctx.fillText(texto2, 80, posY + 30);
    
    posY = alto - 60;
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, posY);
    ctx.lineTo(ancho - 60, posY);
    ctx.stroke();
    
    ctx.font = '11px Arial';
    ctx.fillStyle = '#999999';
    ctx.textAlign = 'center';
    ctx.fillText('Sistema educativo e informativo - Uso permitido solo con fines educativos', ancho / 2, posY + 25);
}

function dibujarSeccion(ctx, titulo, x, y, ancho) {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(x, y - 30, ancho - x * 2, 35);
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(titulo, x + 10, y + 5);
}

function dibujarCampo(ctx, etiqueta, valor, x, y, ancho) {
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(etiqueta, x, y);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(valor, x + 250, y);
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 250, y + 5);
    ctx.lineTo(ancho - 60, y + 5);
    ctx.stroke();
}

function formatearFecha(fechaStr) {
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', opciones);
}

function descargarImagen() {
    const canvas = document.getElementById('documento-canvas');
    const link = document.createElement('a');
    const referencia = document.getElementById('referencia').value || 'documento';
    
    link.href = canvas.toDataURL('image/png');
    link.download = 'Comprobante_' + referencia + '_' + new Date().getTime() + '.png';
    link.click();
}

function imprimirDocumento() {
    const canvas = document.getElementById('documento-canvas');
    const imagenUrl = canvas.toDataURL('image/png');
    
    const ventanaImpresion = window.open('');
    ventanaImpresion.document.write('<!DOCTYPE html><html><head><title>Imprimir Comprobante</title><style>body{margin:0;padding:10px;text-align:center;}img{max-width:100%;height:auto;}</style></head><body><img src="' + imagenUrl + '" /><script>window.print();window.close();</script></body></html>');
}