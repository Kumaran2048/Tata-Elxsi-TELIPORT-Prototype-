"use client"

import { useState, useEffect } from 'react'

export interface SettingsState {
    criticalAlerts: boolean
    warningAlerts: boolean
    maintenanceReminders: boolean
    emailDigest: boolean
    realTimeSync: boolean
    highFidelityRendering: boolean
    predictiveOverlay: boolean
    federatedLearning: boolean
    differentialPrivacy: boolean
    dataSharingConsent: boolean
}

const DEFAULT_SETTINGS: SettingsState = {
    criticalAlerts: true,
    warningAlerts: true,
    maintenanceReminders: false,
    emailDigest: false,
    realTimeSync: true,
    highFidelityRendering: true,
    predictiveOverlay: false,
    federatedLearning: true,
    differentialPrivacy: true,
    dataSharingConsent: false,
}

export function useSettings() {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('taas_settings')
        if (saved) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
            } catch (e) {
                console.error("Failed to parse settings", e)
            }
        }
        setInitialized(true)
    }, [])

    useEffect(() => {
        if (initialized) {
            localStorage.setItem('taas_settings', JSON.stringify(settings))
        }
    }, [settings, initialized])

    const updateSetting = (key: keyof SettingsState, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return { settings, updateSetting, initialized }
}
