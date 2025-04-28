import React, { ReactNode } from 'react';
import Card from './Card';
import Badge, { BadgeVariant } from './Badge';
import { useTheme } from '../../contexts/ThemeContext';

interface TableColumn {
  key: string;
  title: string;
  render?: (value: any, record: any) => ReactNode;
  className?: string;
  isBadge?: boolean;
  badgeOptions?: {
    variant?: BadgeVariant;
    variantMapping?: Record<string, BadgeVariant>;
  };
}

interface DataTableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  onViewAll?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onViewAll
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  // Helper method to determine badge variant from string value
  const getBadgeVariant = (value: string, options?: TableColumn['badgeOptions']): BadgeVariant => {
    if (!options) return 'default';
    
    // If a direct variant mapping is provided
    if (options.variantMapping && options.variantMapping[value.toLowerCase()]) {
      return options.variantMapping[value.toLowerCase()];
    }
    
    // Default mapping by common terms
    switch (value.toLowerCase()) {
      case 'success':
      case 'active':
      case 'online':
      case 'approved':
      case 'complete':
      case 'stable':
      case 'safe':
      case 'low':
        return 'success';
      case 'error':
      case 'failed':
      case 'critical':
      case 'emergency':
      case 'high':
        return 'danger';
      case 'warning':
      case 'pending':
      case 'medium':
        return 'warning';
      case 'info':
      case 'neutral':
        return 'info';
      default:
        return options.variant || 'default';
    }
  };

  return (
    <Card 
      className={`${isDark ? 'bg-gray-800' : 'bg-white'}`}
      shadowX={6}
      shadowY={6}
      shadowBlur={54}
      shadowOpacity={5}
      shadowColor="#000000"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
        <button 
          onClick={handleViewAll}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className={`${isDark ? 'bg-blue-900/40' : 'bg-blue-50'} text-left`}>
              {columns.map((column, index) => (
                <th 
                  key={column.key}
                  className={`py-3 px-4 text-sm font-medium ${
                    isDark ? 'text-blue-50' : 'text-blue-900'
                  } ${
                    index === 0 ? 'rounded-l-lg' : ''
                  } ${
                    index === columns.length - 1 ? 'rounded-r-lg' : ''
                  } ${column.className || ''}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`bg-white divide-y divide-gray-200 ${isDark ? 'bg-gray-800 divide-gray-700 text-gray-200' : ''}`}>
            {data.length > 0 ? (
              data.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  {columns.map((col, _colIndex) => (
                    <td key={`${rowIndex}-${col.key}`} className="px-6 py-4 whitespace-nowrap">
                      {col.render 
                        ? col.render(row[col.key], row)
                        : col.isBadge
                          ? <Badge 
                              variant={getBadgeVariant(row[col.key], col.badgeOptions)}
                              fullWidth
                            >
                              {row[col.key]}
                            </Badge>
                          : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataTable; 