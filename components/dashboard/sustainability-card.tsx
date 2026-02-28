import { Leaf, Zap, Award, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { generateESGReport } from "@/lib/export-utils"
import { toast } from "sonner"

export function SustainabilityCard() {
    const [stats, setStats] = useState({ saved: 0, co2: 0, credits: 0 })
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            await generateESGReport()
            toast.success("ESG Report Generated", { description: "Your Tata TSG compliance PDF is ready." })
        } catch (e) {
            toast.error("Export Failed")
        } finally {
            setExporting(false)
        }
    }

    useEffect(() => {
        async function fetchSustainability() {
            const { data } = await supabase
                .from('sustainability_logs')
                .select('*')
                .limit(1)
                .single()

            if (data) {
                setStats({
                    saved: data.energy_saved_kwh,
                    co2: data.co2_offset_kg,
                    credits: data.carbon_credits_earned
                })
            }
        }
        fetchSustainability()
    }, [])

    return (
        <div className="glass rounded-xl p-5 border-accent/20 bg-accent/5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-accent" />
                        Green Ledger
                    </h3>
                    <p className="text-xs text-muted-foreground">ESG & Sustainability Audit</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded hover:bg-accent/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    {exporting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    Download ESG PDF
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Energy
                    </span>
                    <span className="text-lg font-mono font-bold text-foreground">{stats.saved} <small className="text-[10px] text-muted-foreground">kWh</small></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Leaf className="h-3 w-3" /> $CO_2$ Saved
                    </span>
                    <span className="text-lg font-mono font-bold text-foreground">{stats.co2} <small className="text-[10px] text-muted-foreground">kg</small></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Award className="h-3 w-3" /> Credits
                    </span>
                    <span className="text-lg font-mono font-bold text-accent">{stats.credits}</span>
                </div>
            </div>

            <div className="mt-4 p-2 bg-foreground/5 rounded text-[10px] text-accent text-center border border-accent/10">
                Aligning with Tata Sustainability Group (TSG) compliance
            </div>
        </div>
    )
}
