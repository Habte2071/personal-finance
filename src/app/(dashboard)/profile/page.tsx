'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import axios from 'axios'; // 👈 add for type guard

export default function ProfilePage() {
  const { user } = useAuth();
  const { updateProfile, isUpdating } = useUser();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    currency: user?.currency || 'USD',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const isPasswordLongEnough = passwordData.newPassword.length >= 6;
  const doPasswordsMatch = passwordData.newPassword === passwordData.confirmPassword;
  const isPasswordValid = isPasswordLongEnough && doPasswordsMatch && passwordData.newPassword.length > 0;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      toast({ title: 'Profile updated successfully' });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to update profile',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Unexpected error', variant: 'destructive' });
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast({
        title: 'Error',
        description: 'Please ensure password is at least 6 characters and both fields match',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await api.post('/users/change-password', {
        currentPassword: passwordData.currentPassword.trim(),
        newPassword: passwordData.newPassword.trim(),
      });

      toast({ title: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to change password',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Unexpected error', variant: 'destructive' });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Profile Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    maxLength={3}
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  {passwordData.newPassword && (
                    <p className={`text-xs flex items-center gap-1 ${isPasswordLongEnough ? 'text-green-600' : 'text-red-600'}`}>
                      {isPasswordLongEnough ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      At least 6 characters
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                  {passwordData.confirmPassword && (
                    <p className={`text-xs flex items-center gap-1 ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {doPasswordsMatch ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={!isPasswordValid || isChangingPassword}
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}