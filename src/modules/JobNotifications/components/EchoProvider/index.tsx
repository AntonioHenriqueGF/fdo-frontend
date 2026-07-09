import { useEffect } from 'react';
import { getEcho } from '../../../../Services/echo';

interface EchoProviderProps {
  userId: number;
  onJobUpdated: (payload: unknown) => void;
  children: React.ReactNode;
}

export const EchoProvider: React.FC<EchoProviderProps> = ({
  userId,
  onJobUpdated,
  children,
}) => {
  useEffect(() => {
    const channelName = `App.Models.User.${userId}`;
    const privateChannelName = `private-${channelName}`;

    const echo = getEcho();
    const channel = echo.private(channelName);

    channel.listen('.job-request.updated', onJobUpdated);

    return () => {
      channel.stopListening('.job-request.updated');
      echo.leave(privateChannelName);
    };
  }, [onJobUpdated, userId]);

  return <>{children}</>;
};
