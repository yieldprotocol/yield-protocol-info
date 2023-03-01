import { v4 as uuid } from 'uuid';
import { markMap } from '../config/marks';
import { IAssetMap } from '../types/chain';
import { formatValue } from '../utils/appUtils';

const TvlTable = ({ data, assets }: { data: any[]; assets: IAssetMap }) =>
  data && assets ? (
    <div className="rounded-lg shadow-sm p-2 dark:bg-green-200 bg-green-200 w-full">
      <table className="table min-w-full divide-y">
        <tbody className="divide-y">
          {data.map((x) => {
            const asset = assets[x.id];
            const assetLogo = markMap.get(asset?.symbol);
            return (
              <tr key={uuid()} className="items-center group">
                <td className="p-3 text-start items-center flex gap-4">
                  <div className="flex relative">
                    <div className="h-6 w-6">
                      <div className="z-0">{assetLogo}</div>
                    </div>
                  </div>
                  {x.value >= 0 && (
                    <div className="text-md font-medium text-gray-900 truncate">
                      <div>
                        ${formatValue(x.value, 0)} <span className="font-extralight">{asset?.symbol}</span>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;

export default TvlTable;
