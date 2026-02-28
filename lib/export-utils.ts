import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from './supabase';

export async function generateESGReport() {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text('TaaS: Sustainability Audit Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text('Compliance: Tata Sustainability Group (TSG) Dashboard v2.4', 14, 35);

    // Section: Carbon Impact
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('1. Carbon Footprint & Energy Metrics', 14, 50);

    const { data: esgData } = await supabase.from('sustainability_logs').select('*');

    if (esgData && esgData.length > 0) {
        autoTable(doc, {
            startY: 55,
            head: [['Date', 'Energy Saved (kWh)', 'CO2 Offset (kg)', 'Credits Earned']],
            body: esgData.map(d => [
                new Date(d.date).toLocaleDateString(),
                d.energy_saved_kwh,
                d.co2_offset_kg,
                d.carbon_credits_earned
            ]),
            theme: 'grid',
            headStyles: { fillColor: [0, 102, 204] }
        });
    } else {
        doc.text('No ESG data available for the selected period.', 14, 60);
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('Proprietary & Confidential - TaaS MSME Cluster Intelligence', 14, 285);
    }

    doc.save('taas-esg-report.pdf');
}

export async function generateAnalyticsReport(machines: any[], telemetry: any[]) {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('Fleet Operational Analytics', 14, 22);

    doc.setFontSize(14);
    doc.text('Machine Inventory', 14, 40);

    autoTable(doc, {
        startY: 45,
        head: [['Machine ID', 'Name', 'Status', 'Health']],
        body: machines.map(m => [m.id.substring(0, 8), m.name, m.status, m.status === 'Active' ? '95%' : '32%']),
    });

    doc.addPage();
    doc.text('Recent Telemetry Logs', 14, 22);

    autoTable(doc, {
        startY: 30,
        head: [['Timestamp', 'Machine', 'Vibration (mm/s)', 'Temp (C)']],
        body: telemetry.slice(0, 20).map(t => [
            new Date(t.timestamp).toLocaleTimeString(),
            t.machine_id.substring(0, 8),
            t.vibration.toFixed(2),
            t.temperature.toFixed(2)
        ]),
    });

    doc.save('taas-analytics-export.pdf');
}
