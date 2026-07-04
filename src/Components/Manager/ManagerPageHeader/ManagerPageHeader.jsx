import React from 'react';
import PageHeader from '../../Common/PageHeader/PageHeader';

// Manager list-page header (title + search + optional add button).
// Thin wrapper over the shared PageHeader so manager pages import from here.
const ManagerPageHeader = (props) => <PageHeader {...props} />;

export default ManagerPageHeader;
