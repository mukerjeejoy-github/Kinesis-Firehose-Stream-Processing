document.addEventListener('DOMContentLoaded', async () => {

    // Dynamically import the correct utility based on the environment variable
    let sendEventWithRetry;

    if (IS_FIREHOSE == "enabled") {
        const { sendEventWithRetry: sendEventWithRetryFirehose } = await import('./firehose-utils.js');
        sendEventWithRetry = sendEventWithRetryFirehose;
    } else {
        const { sendEventWithRetry: sendEventWithRetryKinesis } = await import('./kinesis-streams-utils.js');
        sendEventWithRetry = sendEventWithRetryKinesis;
    }

    // Initialize members array with initial dummy data
    let members = [
        { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St', timestamp: new Date().toISOString(), isDummy: true },
        { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com', phone: '987-654-3210', address: '456 Elm St', timestamp: new Date().toISOString(), isDummy: true }
    ];

    renderMemberTable();

    document.getElementById('member-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-button').addEventListener('click', cancelEdit);

    function renderMemberTable() {
        const tbody = document.getElementById('member-table-body');
        tbody.innerHTML = ''; // Clear existing rows

        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.age}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.address}</td>
                <td class="actions">
                    ${member.isDummy ? '<span class="dummy-tag">Dummy</span>' : ''}
                    <button class="edit-button" data-id="${member.id}"${member.isDummy ? ' disabled' : ''}>Edit</button>
                    <button class="delete-button" data-id="${member.id}"${member.isDummy ? ' disabled' : ''} class="delete">Delete</button>
                </td>
                <td>${member.timestamp}</td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const memberId = parseInt(e.target.getAttribute('data-id'));
                editMember(memberId);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const memberId = parseInt(e.target.getAttribute('data-id'));
                deleteMember(memberId);
            });
        });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        const id = parseInt(document.getElementById('member-id').value);
        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const timestamp = new Date().toISOString();

        try {
            showLoadingIndicator();

            if (id) {
                const member = members.find(member => member.id === id);
                if (member) {
                    member.name = name;
                    member.age = age;
                    member.email = email;
                    member.phone = phone;
                    member.address = address;
                    member.timestamp = timestamp;

                    await sendEventWithRetry('MemberUpdated', member);
                }
            } else {
                const newMember = {
                    id: members.length ? Math.max(...members.map(m => m.id)) + 1 : 1,
                    name,
                    age,
                    email,
                    phone,
                    address,
                    timestamp
                };
                members.push(newMember);

                await sendEventWithRetry('MemberAdded', newMember);
            }

            renderMemberTable();
            resetForm();
            hideLoadingIndicator();
        } catch (error) {
            console.error('Error submitting form:', error);
            hideLoadingIndicator();
            alert('An error occurred. Please try again.');
        }
    }

    function resetForm() {
        document.getElementById('member-id').value = '';
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('address').value = '';
        document.getElementById('form-title').textContent = 'Add Member';
        document.getElementById('cancel-button').classList.add('hidden');
    }

    function editMember(id) {
        const member = members.find(member => member.id === id);
        if (member) {
            document.getElementById('member-id').value = member.id;
            document.getElementById('name').value = member.name;
            document.getElementById('age').value = member.age;
            document.getElementById('email').value = member.email;
            document.getElementById('phone').value = member.phone;
            document.getElementById('address').value = member.address;
            document.getElementById('form-title').textContent = 'Edit Member';
            document.getElementById('cancel-button').classList.remove('hidden');
        }
    }

    async function deleteMember(id) {
        const confirmDelete = confirm('Are you sure you want to delete this member?');

        if (!confirmDelete) {
            return;
        }

        try {
            showLoadingIndicator();
            members = members.filter(member => member.id !== id);

            await sendEventWithRetry('MemberDeleted', { id });

            renderMemberTable();
            hideLoadingIndicator();
        } catch (error) {
            console.error('Error deleting member:', error);
            hideLoadingIndicator();
            alert('An error occurred. Please try again.');
        }
    }

    function cancelEdit() {
        resetForm();
    }

    function showLoadingIndicator() {
        document.getElementById('loading-indicator').classList.remove('hidden');
    }

    function hideLoadingIndicator() {
        document.getElementById('loading-indicator').classList.add('hidden');
    }
});
