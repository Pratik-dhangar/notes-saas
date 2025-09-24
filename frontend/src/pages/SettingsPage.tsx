import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, User, Building, CreditCard } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tenant', label: 'Organization', icon: Building },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and organization settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your personal account information
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-200 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed at this time
                    </p>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={user?.role || ''}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-200 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenant' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Organization Information</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your organization settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="orgName"
                      value={user?.tenant?.name || ''}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="orgSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Organization Slug
                    </label>
                    <input
                      type="text"
                      id="orgSlug"
                      value={user?.tenant?.slug || ''}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Plan
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user?.tenant?.plan === 'PRO'
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {user?.tenant?.plan || 'FREE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Billing & Subscription</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your subscription and billing information
                  </p>
                </div>

                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Billing management coming soon</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Subscription management features will be available in a future update.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  disabled
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}