document.addEventListener("DOMContentLoaded", async function () {

    await getAllSubscriptions();

});

async function getAllSubscriptions() {
    try {
        const response = await fetch('/subscriptions');
        if (!response.ok) {
            throw new Error('Erreur de réseau ou réponse du serveur non ok: ' + response.statusText);
        }

        const subscriptions = await response.json();
        const table = document.getElementById('subscriptionTable');

        table.innerHTML = `<tr>
            <th>Numéro d'Opportunité</th>
            <th>Nom du Client</th>
            <th>Intermédiaire</th>
            <th>Date de Création</th>
            <th>Word</th>
            <th>PDF</th>
        </tr>`;

        if (subscriptions.length === 0) {
            table.innerHTML += '<tr><td colspan="5">Il n\'y a pas de souscriptions.</td></tr>';
        } else {
            subscriptions.forEach(subscription => {
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${subscription.numero_opportunite}</td>
                    <td>${subscription.nom_client}</td>
                    <td>${subscription.intermediaire}</td>
                    <td>${subscription.creation_date}</td>
                    <td class="dl-icons">
                        <a href="/telechargement/docx/${subscription.numero_opportunite}">
                            <img src="/img/icons/fa-solid-file-alt.svg" alt="Téléchargez le docx">
                        </a>
                    </td>
                    <td class="dl-icons">
                        <a href="/telechargement/pdf/${subscription.numero_opportunite}">
                            <img src="/img/icons/fa-solid-file-pdf.svg" alt="Téléchargez le pdf">
                        </a>
                    </td>`;                
            });
        }
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('subscriptionTable').innerHTML = `<tr><td colspan="5">Erreur lors du chargement des données</td></tr>`;
    }
}
