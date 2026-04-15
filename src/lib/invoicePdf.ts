import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice } from './invoiceStore';
import { calcLineTotal, calcLineTax, calcSubtotal, calcTotalTax, calcGrandTotal, formatCurrency } from './invoiceStore';

export function generateInvoicePDF(invoice: Invoice, companyData: { name: string; tagline: string; address: string; postalCode: string; city: string; phone: string; phoneDisplay: string; email: string; vatNumber: string }): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const navy = [10, 22, 40] as [number, number, number];
  const amber = [212, 168, 83] as [number, number, number];
  const gray = [120, 130, 150] as [number, number, number];

  // Header bar
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(companyData.name, 20, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...amber);
  doc.text(companyData.tagline, 20, 28);

  doc.setTextColor(200, 200, 210);
  doc.setFontSize(8);
  doc.text(`${companyData.address}, ${companyData.postalCode} ${companyData.city} | ${companyData.phoneDisplay} | ${companyData.email}`, 20, 36);

  // Invoice title
  doc.setTextColor(...amber);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', pageWidth - 20, 22, { align: 'right' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(invoice.number, pageWidth - 20, 32, { align: 'right' });

  // Invoice details box
  let y = 58;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(pageWidth / 2 + 10, y - 5, pageWidth / 2 - 30, 35, 3, 3, 'F');

  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const details = [
    ['Date d\'émission', invoice.issueDate],
    ['Date d\'échéance', invoice.dueDate],
    ['Statut', invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'],
  ];
  details.forEach(([label, value], i) => {
    doc.setTextColor(...gray);
    doc.text(label, pageWidth / 2 + 18, y + 5 + i * 10);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - 28, y + 5 + i * 10, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });

  // Client info
  doc.setTextColor(...amber);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURER À', 20, y);

  doc.setTextColor(...navy);
  doc.setFontSize(11);
  doc.text(invoice.client.name, 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  const clientLines = [
    invoice.client.address,
    `${invoice.client.postalCode} ${invoice.client.city}`,
    invoice.client.email,
    invoice.client.phone,
  ].filter(Boolean);
  if (invoice.client.vatNumber) clientLines.push(`TVA: ${invoice.client.vatNumber}`);
  clientLines.forEach((line, i) => {
    doc.text(line, 20, y + 18 + i * 5);
  });

  // Table
  y = 105;
  const tableData = invoice.items.map((item) => [
    item.description,
    String(item.quantity),
    formatCurrency(item.unitPrice),
    `${item.vatRate}%`,
    formatCurrency(calcLineTotal(item)),
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Qté', 'Prix unit.', 'TVA', 'Total HT']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: [50, 60, 80],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 252],
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 30 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 30 },
    },
    margin: { left: 20, right: 20 },
  });

  // Totals
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  const totalsX = pageWidth - 20;
  const labelsX = pageWidth - 80;

  const subtotal = calcSubtotal(invoice.items);
  const tax = calcTotalTax(invoice.items);
  const total = calcGrandTotal(invoice.items);

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('Sous-total HT', labelsX, finalY);
  doc.setTextColor(...navy);
  doc.text(formatCurrency(subtotal), totalsX, finalY, { align: 'right' });

  doc.setTextColor(...gray);
  doc.text('TVA', labelsX, finalY + 8);
  doc.setTextColor(...navy);
  doc.text(formatCurrency(tax), totalsX, finalY + 8, { align: 'right' });

  doc.setDrawColor(...amber);
  doc.setLineWidth(0.5);
  doc.line(labelsX, finalY + 13, totalsX, finalY + 13);

  doc.setFillColor(...navy);
  doc.roundedRect(labelsX - 5, finalY + 16, totalsX - labelsX + 10, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', labelsX, finalY + 25);
  doc.setFontSize(12);
  doc.text(formatCurrency(total), totalsX, finalY + 25, { align: 'right' });

  // Payment info
  let noteY = finalY + 45;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...amber);
  doc.text('INFORMATIONS DE PAIEMENT', 20, noteY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  noteY += 8;
  doc.text(`Compte bancaire : ${invoice.bankAccount}`, 20, noteY);
  noteY += 6;
  doc.text(`Communication : ${invoice.number}`, 20, noteY);
  noteY += 6;
  doc.text(`Conditions : ${invoice.paymentTerms}`, 20, noteY);

  // Notes
  if (invoice.notes) {
    noteY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...amber);
    doc.text('NOTES', 20, noteY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - 40);
    doc.text(noteLines, 20, noteY + 7);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(245, 247, 250);
  doc.rect(0, footerY - 5, pageWidth, 20, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.text(`${companyData.name} - ${companyData.tagline} | TVA: ${companyData.vatNumber} | ${companyData.email} | ${companyData.phoneDisplay}`, pageWidth / 2, footerY + 2, { align: 'center' });

  return doc;
}
