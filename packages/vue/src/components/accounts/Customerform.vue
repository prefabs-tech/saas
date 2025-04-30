const prepareComponent = async () => { try { await initializeForm(); await
loadAccountData(); await loadAccountRoles(); await loadAccountUsers(); await
loadAccountInvitations(); } catch (error) { console.error("Error preparing
component:", error); throw error; } }; const initializeForm = async () => { if
(props.id) { const response = await accountStore.getAccount(props.id); if
(response?.data) { formData.value = { ...response.data, useSeparateDatabase:
!!response.data.database, }; } } }; const loadAccountData = async () => { if
(props.id) { const response = await accountStore.getAccount(props.id); if
(response?.data) { accountData.value = response.data; } } }; const
loadAccountRoles = async () => { if (props.id) { const response = await
accountStore.getAccountRoles(props.id); if (response?.data) { accountRoles.value
= response.data; } } }; const loadAccountUsers = async () => { if (props.id) {
const response = await accountStore.getAccountUsers(props.id); if
(response?.data) { accountUsers.value = response.data; } } }; const
loadAccountInvitations = async () => { if (props.id) { const response = await
accountStore.getAccountInvitations(props.id); if (response?.data) {
accountInvitations.value = response.data; } } };
