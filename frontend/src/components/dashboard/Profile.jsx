import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { User, Mail, Phone, FileText, Save, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', phone: '', bio: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Assuming userId is stored in localStorage after login
    const userId = localStorage.getItem('userId');

    // Fetch user data from Convex
    const user = useQuery(api.users.getUser, userId ? { userId } : "skip");
    const updateProfile = useMutation(api.users.updateProfile);

    // Initialize form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!userId) return;

        setIsSaving(true);
        try {
            await updateProfile({
                userId,
                fullName: formData.fullName,
                phone: formData.phone,
                bio: formData.bio
            });
            setSaveSuccess(true);
            setIsEditing(false);

            // Hide success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!userId) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Authentication Required</h2>
                <p className="text-slate-500 mt-2">Please log in to view your profile.</p>
            </div>
        );
    }

    if (user === undefined) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-500">Manage your personal information and preferences.</p>
                </div>

                {saveSuccess && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Profile updated!</span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100">

                {/* Profile Header section */}
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100 mb-8">
                    {user?.profilePic ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner flex-shrink-0">
                            <User className="w-10 h-10" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {user?.fullName || "Candidate"}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email}</span>
                            {user?.isGoogleUser && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    Google Auth
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                                    {user?.fullName || <span className="text-slate-400 italic">Not provided</span>}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                                    placeholder="+1 (555) 000-0000"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                                    {user?.phone || <span className="text-slate-400 italic">Not provided</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Professional Bio
                        </label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white resize-none"
                                placeholder="A brief summary of your professional background..."
                            />
                        ) : (
                            <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 min-h-[100px] whitespace-pre-wrap">
                                {user?.bio || <span className="text-slate-400 italic">No bio added yet. Tell us about your career!</span>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        fullName: user?.fullName || '',
                                        phone: user?.phone || '',
                                        bio: user?.bio || ''
                                    });
                                }}
                                className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
