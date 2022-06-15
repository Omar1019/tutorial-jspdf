function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let departamento = document.getElementById('departamentos').value;
        let nombres = document.getElementById('nombre').value;
        let puestos = document.getElementById('puesto').value;
        let numerodealfitions = document.getElementById('numerodealfitrion').value;
        let newhotel = document.querySelector('input[name="newhotels"]:checked').value;

        generatePDF(departamento,
            nombres, puestos, numerodealfitions, newhotel);
    })

});

async function generatePDF(departamento,
    nombres, puestos, numerodealfitions, newhotel) {
    
        const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('px', 'pt', 'letter');

    pdf.addImage(image, 'PNG', 0, 0, 565, 792);
    pdf.addImage(signatureImage, 'PNG', 200, 605, 300, 60);

    pdf.setFontSize(10);
    pdf.text(departamento, 145, 472);

    const date = new Date();
    pdf.text(date.getUTCDate().toString(), 145, 517);
    pdf.text((date.getUTCMonth() + 1).toString(), 170, 517);
    pdf.text(date.getUTCFullYear().toString(), 190, 517);

    pdf.setFontSize(10);
    pdf.text(nombres, 145, 456);
    pdf.text(numerodealfitions, 145, 500);
    pdf.text(puestos, 145, 486);

    pdf.setFillColor(0,0,0);
    
    if (parseInt(newhotel) === 0) {
        pdf.circle(0, 0, 0, 'FD');
    } else {
        pdf.circle(204, 309, 4, 'FD');
    }



    pdf.save("Resguardo de aplicaciones.pdf");

}