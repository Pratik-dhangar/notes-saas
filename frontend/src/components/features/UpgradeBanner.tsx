import { useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tenantService } from '../../services/tenantService';

interface UpgradeBannerProps {
  onUpgradeSuccess: () => void;
}

export const UpgradeBanner = ({ onUpgradeSuccess }: UpgradeBannerProps) => {
  const { user } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleUpgrade = async () => {
    if (!user?.tenant.slug) return;
    
    setIsUpgrading(true);
    try {
      await tenantService.upgradeTenant(user.tenant.slug);
      onUpgradeSuccess();
      setIsVisible(false);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex">
          <Crown className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              You've reached your note limit
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Free plan is limited to 3 notes. Upgrade to Pro for unlimited notes.
            </p>
            {user?.role === 'ADMIN' ? (
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {isUpgrading ? 'Upgrading...' : 'Upgrade to Pro'}
              </button>
            ) : (
              <p className="text-sm text-yellow-700 mt-2 font-medium">
                Please ask your admin to upgrade your plan.
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-400 hover:text-yellow-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};