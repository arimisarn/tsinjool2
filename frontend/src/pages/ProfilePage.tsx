"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Camera, User, Mail, Save, Edit3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"

interface UserProfile {
  user_info: {
    username: string
    email: string
    first_name: string
    last_name: string
  }
  bio: string
  photo?: string
  coaching_type: string
  level: number
  points: number
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    coaching_type: "",
  })

  useEffect(() => {
    document.title = "Tsinjool - Mon Profil"
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // Mode démo
        const mockProfile: UserProfile = {
          user_info: {
            username: "marie.dupont",
            email: "marie.dupont@example.com",
            first_name: "Marie",
            last_name: "Dupont",
          },
          bio: "Passionnée par le développement personnel et la recherche d'équilibre dans la vie. J'aime la méditation, la lecture et les voyages.",
          photo: undefined,
          coaching_type: "life",
          level: 2,
          points: 150,
        }
        setProfile(mockProfile)
        setFormData({
          first_name: mockProfile.user_info.first_name,
          last_name: mockProfile.user_info.last_name,
          bio: mockProfile.bio,
          coaching_type: mockProfile.coaching_type,
        })
        setLoading(false)
        return
      }

      const response = await axios.get("https://tsinjool-backend.onrender.com/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      })

      setProfile(response.data)
      setFormData({
        first_name: response.data.user_info.first_name,
        last_name: response.data.user_info.last_name,
        bio: response.data.bio || "",
        coaching_type: response.data.coaching_type,
      })
    } catch (error: any) {
      console.error(error)
      toast.error("Erreur lors du chargement du profil.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        // Mode démo
        toast.success("Profil mis à jour ! (Mode démo)")
        setEditing(false)
        setSaving(false)
        return
      }

      await axios.put("https://tsinjool-backend.onrender.com/api/profile/", formData, {
        headers: { Authorization: `Token ${token}` },
      })

      toast.success("Profil mis à jour avec succès !")
      setEditing(false)
      loadProfile()
    } catch (error: any) {
      console.error(error)
      toast.error("Erreur lors de la mise à jour du profil.")
    } finally {
      setSaving(false)
    }
  }

  const getCoachingTypeLabel = (type: string) => {
    const labels = {
      life: "Coaching de vie",
      career: "Coaching de carrière",
      health: "Coaching santé",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getCoachingTypeColor = (type: string) => {
    const colors = {
      life: "bg-green-100 text-green-800",
      career: "bg-blue-100 text-blue-800",
      health: "bg-purple-100 text-purple-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profil non trouvé.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-sm text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              {editing ? "Annuler" : "Modifier"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.photo ? (
                    <img
                      src={profile.photo || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {editing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {profile.user_info.first_name} {profile.user_info.last_name}
                </h2>
                <p className="text-white/80 mb-3">@{profile.user_info.username}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{profile.level}</span>
                    </div>
                    <span className="text-sm">Niveau {profile.level}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{profile.points}</span> points
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-600">{profile.user_info.email}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                          {profile.user_info.first_name || "Non renseigné"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                          {profile.user_info.last_name || "Non renseigné"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de coaching</label>
                    {editing ? (
                      <select
                        value={formData.coaching_type}
                        onChange={(e) => setFormData({ ...formData, coaching_type: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="life">Coaching de vie</option>
                        <option value="career">Coaching de carrière</option>
                        <option value="health">Coaching santé</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getCoachingTypeColor(profile.coaching_type)}`}
                        >
                          {getCoachingTypeLabel(profile.coaching_type)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio et statistiques */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">À propos</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                    {editing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Parlez-nous de vous..."
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-600 min-h-[100px]">
                        {profile.bio || "Aucune biographie renseignée."}
                      </div>
                    )}
                  </div>

                  {/* Statistiques */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Mes statistiques</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{profile.level}</div>
                        <div className="text-sm text-gray-600">Niveau</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{profile.points}</div>
                        <div className="text-sm text-gray-600">Points</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {editing && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
