import React from 'react';
import PageHeader from '../../Common/PageHeader/PageHeader';

// Admin list-page header (title + search + optional add button).
// Thin wrapper over the shared PageHeader so admin pages import from here.
const AdminPageHeader = (props) => <PageHeader {...props} />;

export default AdminPageHeader;
