import { CommonNode } from 'Models/typed';

export function convertCommonNodeToCsv(data: CommonNode[]): string {
  if (data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]).filter((key) => key !== 'nodeName');

  const csvRows = data.map((item) =>
    headers
      .map((header) => {
        const value = (item as Record<string, unknown>)[header];

        // Special handling for 'assignedRules'
        if (header === 'assignedRules' && Array.isArray(value)) {
          return `"${value.map((rule) => (rule as Record<string, unknown>).name || '').join(';')}"`;
        }

        return typeof value === 'string'
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(',')
  );

  return [headers.join(','), ...csvRows].join('\n');
}
