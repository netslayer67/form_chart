var myChart; // Deklarasikan variabel myChart di luar fungsi untuk menyimpan instance Chart

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('/data');
        const { dataTeman, chartData } = await response.json();

        // Hapus chart yang sudah ada jika ada sebelumnya
        if (myChart) {
            myChart.destroy();
        }

        // Configure the chart data
        const data = {
            labels: chartData.labels,
            datasets: chartData.datasets,
        };

        // Configure the chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Friend Statistics',
                    position: 'bottom',
                    font: {
                        size: 16,
                    },
                    color: '#aa7942',
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: false,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                },
            },
        };

        // Create a new chart instance
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });

        // Display dataTeman
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = '';
        dataTeman.forEach((friend) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${friend.name} (${friend.gender}, ${friend.age})`;
            dataList.appendChild(listItem);
        });
    } catch (error) {
        console.error(error);
    }
});
