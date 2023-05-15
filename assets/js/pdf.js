function downloadPDF() {
    const docDefinition = {
        content: [
            {
                text: 'Table and Chart Report',
                fontSize: 20,
                alignment: 'center', // Align the title to the center
                margin: [0, 0, 0, 15]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [['Name', 'Gender', 'Age']] // Header row
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return rowIndex === 0 ? '#CCCCCC' : null; // Header row color
                    }
                },
                margin: [0, 0, 0, 15]
            },
            {
                image: '',
                width: 'auto',
                height: 300,
                margin: [0, 15, 0, 0],
                alignment: 'center', // Align the chart to the center
                layout: {
                    Color: function () {
                        return 'red'; // Set background color to grey
                    }
                }
            }
        ]
    };

    const table = document.querySelector('.table');
    const tableWidth = table.offsetWidth;
    const rows = Array.from(table.querySelectorAll('tr'));
    const tableData = rows.map(row =>
        Array.from(row.querySelectorAll('th, td')).map(cell => cell.textContent)
    );
    docDefinition.content[1].table.body = docDefinition.content[1].table.body.concat(
        tableData.slice(1)
    );

    const canvas = document.querySelector('#myChart');
    const chartDataUrl = canvas.toDataURL('image/jpeg', 1.0);
    docDefinition.content[2].image = chartDataUrl;
    docDefinition.content[2].width = tableWidth;

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('report.pdf');
}

const downloadButton = document.getElementById('downloadPdfButton');
downloadButton.addEventListener('click', downloadPDF);
