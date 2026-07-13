/**
 * HND Facial Attendance System - Export Utilities
 * PDF and CSV export helpers
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (title, data, columns, options = {}) => {
  const doc = new jsPDF({
    orientation: options.landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(10, 25, 41);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('HND Facial Attendance System', 14, 15);

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(title, 14, 23);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, 14, 30);

  // Table
  const tableColumns = columns.map((col) => ({
    header: col.header,
    dataKey: col.key,
  }));

  autoTable(doc, {
    startY: 42,
    columns: tableColumns,
    body: data,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    styles: {
      cellPadding: 3,
      lineColor: [203, 213, 225],
      lineWidth: 0.1,
    },
    margin: { top: 42, left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    },
  });

  // Summary if provided
  if (options.summary) {
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Summary:', 14, finalY);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    options.summary.forEach((line, i) => {
      doc.text(line, 14, finalY + 7 + i * 5);
    });
  }

  return doc;
};

export const downloadPDF = (title, data, columns, filename, options = {}) => {
  const doc = generatePDF(title, data, columns, options);
  doc.save(filename || `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};

export const generateCSV = (data, columns) => {
  const header = columns.map((col) => `"${col.header}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return '""';
        return `"${String(value).replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [header, ...rows].join('\n');
};

export const downloadCSV = (data, columns, filename) => {
  const csv = generateCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename || 'report.csv');
};

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
