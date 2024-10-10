import GroupInfo from '@/components/group/GroupInfo';
import TxHistory from '@/components/txHistory/TxHistory';
import { useState } from 'react';
import { Members } from '@/components/members/Members';

interface TabData {
  id: string;
  label: string;
  content: React.ReactNode;
}

const tabsData: TabData[] = [
  {
    id: 'members',
    label: 'Members',
    content: <Members />,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    content: <TxHistory />,
  },
];

export default function Group() {
  const [activeTab, setActiveTab] = useState(tabsData[0].id);
  return (
    <div className='w-full h-full flex flex-col md:flex-row gap-4'>
      <section className='basis-[calc(33.333%-2.5px)] border-1 border-gray-200 dark:border-gray-700 rounded-lg py-5 sm:py-10 px-2 sm:px-5'>
        <GroupInfo />
      </section>
      <section className='basis-[calc(66.667%-2.5px)] flex flex-col border-1 border-gray-200 dark:border-gray-700 rounded-lg py-5 sm:py-10 px-2 sm:px-5 min-h-screen'>
        <div className='flex justify-center text-gray-500 border-gray-200 dark:border-gray-700 mb-5'>
          <ul
            className='flex -mb-px text-sm font-medium text-center'
            role='tablist'
          >
            {tabsData.map((tab) => (
              <li key={tab.id} className='' role='presentation'>
                <button
                  className={`inline-block p-4 px-5 sm:px-20 border-b-2 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'text-primary border-primary'
                      : 'hover:text-primary hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  role='tab'
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {tabsData.map((tab) => (
          <div
            key={tab.id}
            className={`text-gray-900 h-full ${
              activeTab === tab.id ? '' : 'hidden'
            }`}
            role='tabpanel'
            aria-labelledby={`${tab.id}-tab`}
          >
            {tab.content}
          </div>
        ))}
      </section>
    </div>
  );
}
