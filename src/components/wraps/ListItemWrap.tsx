import Link from 'next/link';

const ListItemWrap = ({ item, type, children }: { item: any; type: string; children: any }) => (
  <Link href={`/${type}/${item.id}`} passHref>
    <div
      className="cursor-pointer rounded-lg p-5 align-middle justify-items-start hover:bg-green-300 shadow-sm bg-green-100 hover:opacity-80 dark:bg-green-400"
      style={{
        background: `linear-gradient( ${item.startColor?.toString().concat('96')} , ${item.endColor?.toString()} )`,
      }}
    >
      <div className="rounded-lg p-.5 align-middle justify-items-center">{children}</div>
    </div>
  </Link>
);

export default ListItemWrap;
