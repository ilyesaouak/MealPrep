import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Save,
  LogOut,
  User,
  Settings,
  Heart,
  Clock,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/layout/NavBar";
import UserPreferences from "./UserPreferences";
import { supabase } from "@/lib/supabase";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // If user is not logged in, redirect to home
    if (!user) {
      navigate("/");
      return;
    }

    // Load user profile data
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setName(data.name || "");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update the user profile in Supabase
      const { error: updateError } = await supabase
        .from("users")
        .update({ name })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setDeleteError("Password is required");
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // First verify the password is correct
      const {
        data: { session },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password,
      });

      if (signInError || !session) {
        setDeleteError("Incorrect password");
        setDeleteLoading(false);
        return;
      }

      // Password is correct, proceed with account deletion using the edge function
      const { error } = await supabase.functions.invoke("delete_user", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        setDeleteError(error.message || "Failed to delete account");
        setDeleteLoading(false);
        return;
      }

      // Successfully deleted account
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      setDeleteError("An unexpected error occurred");
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar activePage="profile" />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                    <User className="h-12 w-12 text-emerald-600" />
                  </div>
                  <CardTitle className="text-center">
                    {name || "User"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {user.email}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardFooter className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                </Button>

                <AlertDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="password" className="mb-2 block">
                        Enter your password to confirm
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="mb-2"
                      />
                      {deleteError && (
                        <p className="text-sm text-red-600 mt-1">
                          {deleteError}
                        </p>
                      )}
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleteLoading}>
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete Account"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6 bg-white border">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal details here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>
                          Profile updated successfully!
                        </AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="mt-4" disabled={loading}>
                        {loading ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardContent className="space-y-6">
                    <UserPreferences userId={user.id} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">
                            Receive updates about new recipes and features
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Weekly Meal Plan Reminders
                          </h3>
                          <p className="text-sm text-gray-500">
                            Get reminded to plan your meals for the week
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="meal-plan-reminders"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Inventory Alerts</h3>
                          <p className="text-sm text-gray-500">
                            Get notified when ingredients are running low
                          </p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="inventory-alerts"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Save className="h-4 w-4 mr-2" /> Save Notification
                      Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
