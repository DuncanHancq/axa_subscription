const quill = new Quill('.quill-editor', {
    theme: 'snow'
});

quill.on('text-change', function(delta, oldDelta, source) {
    console.log(quill.container.firstChild.innerHTML);
    document.querySelector('#descriptif_detaille').value = quill.container.firstChild.innerHTML;
});

document.getElementById('montant1').addEventListener('input', updateTotal);
document.getElementById('montant2').addEventListener('input', updateTotal);

function updateTotal() {
    const cost1 = Number(document.getElementById('montant1').value) || 0;
    const cost2 = Number(document.getElementById('montant2').value) || 0;
    const sum = cost1 + cost2;
    document.getElementById('montant3').value = sum;
}