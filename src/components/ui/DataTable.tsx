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
  viewAllLink?: string;
  className?: string;
  onViewAll?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  viewAllLink = '#view-all',
  className = '',
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
      className={className}
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
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition-colors"
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
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((record, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`${isDark ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-50 border-gray-200'}`}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${column.key}`} 
                    className={`${column.isBadge ? 'p-0' : 'py-6 px-4'} ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    } text-sm`}
                  >
                    {column.render ? (
                      column.render(record[column.key], record)
                    ) : column.isBadge && column.badgeOptions ? (
                      <Badge 
                        variant={getBadgeVariant(record[column.key], column.badgeOptions)} 
                        fullWidth
                      >
                        {record[column.key]}
                      </Badge>
                    ) : (
                      record[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataTable; 