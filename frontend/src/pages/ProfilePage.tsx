"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Camera,
  User,
  Save,
  Edit3,
} from "lucide-react"
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
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

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
        toast.error("Non connecté")
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
      if (!token) return

      const data = new FormData()
      data.append("first_name", formData.first_name)
      data.append("last_name", formData.last_name)
      data.append("bio", formData.bio)
      data.append("coaching_type", formData.coaching_type)
      if (photoFile) data.append("photo", photoFile)

      await axios.put("https://tsinjool-backend.onrender.com/api/profile/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Profil mis à jour avec succès !")
      setEditing(false)
      setPhotoFile(null)
      setPhotoPreview(null)
      loadProfile()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la mise à jour.")
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <p className="text-gray-600">Profil introuvable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-sm text-gray-600">Vos infos personnelles</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Edit3 className="w-4 h-4" />
            {editing ? "Annuler" : "Modifier"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Photo */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="object-cover w-full h-full" />
                ) : profile.photo ? (
                  <img src={profile.photo} alt="profile" className="object-cover w-full h-full" />
                ) : (
                  <User className="text-gray-500 w-12 h-12" />
                )}
              </div>
              {editing && (
                <>
                  <label htmlFor="photoUpload">
                    <div className="absolute -bottom-2 -right-2 bg-white border shadow w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
                      <Camera className="w-4 h-4 text-purple-600" />
                    </div>
                  </label>
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {profile.user_info.first_name} {profile.user_info.last_name}
              </h2>
              <p className="text-gray-500">@{profile.user_info.username}</p>
              <span className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${getCoachingTypeColor(profile.coaching_type)}`}>
                {getCoachingTypeLabel(profile.coaching_type)}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              {editing ? (
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              ) : (
                <p className="text-gray-700">{profile.user_info.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              {editing ? (
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              ) : (
                <p className="text-gray-700">{profile.user_info.last_name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-700">{profile.user_info.email}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              {editing ? (
                <textarea
                  rows={4}
                  className="w-full p-3 border rounded-lg resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de coaching</label>
              {editing ? (
                <select
                  className="w-full p-3 border rounded-lg"
                  value={formData.coaching_type}
                  onChange={(e) => setFormData({ ...formData, coaching_type: e.target.value })}
                >
                  <option value="life">Coaching de vie</option>
                  <option value="career">Coaching de carrière</option>
                  <option value="health">Coaching santé</option>
                </select>
              ) : (
                <p className="text-gray-700">{getCoachingTypeLabel(profile.coaching_type)}</p>
              )}
            </div>
          </div>

          {/* Save */}
          {editing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
