import { ProfileWithAddress } from '@/types';
import ProfilePreview from '@/components/members/ProfilePreview';

interface MemberListProps {
  members: ProfileWithAddress[];
  handleTrust: (profile: ProfileWithAddress) => void;
  handleUntrust: (profile: ProfileWithAddress) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  handleTrust,
  handleUntrust,
}) => {
  return (
    <ul className='w-full'>
      {members.map((member) => (
        <li
          key={member.address}
          className='flex items-center justify-between p-4 py-2 hover:bg-accent/20 hover:cursor-default'
        >
          <ProfilePreview
            profile={member}
            handleTrust={handleTrust}
            handleUntrust={handleUntrust}
          />
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
