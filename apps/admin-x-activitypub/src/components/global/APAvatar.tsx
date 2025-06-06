import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import getUsername from '@utils/get-username';
import {ActorProperties} from '@tryghost/admin-x-framework/api/activitypub';
import {LucideIcon, Skeleton} from '@tryghost/shade';
import {useNavigate} from '@tryghost/admin-x-framework';

type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'notification';

interface APAvatarProps {
    author: {
        icon: {
            url: string;
        };
        name: string;
        handle?: string;
    } | undefined;
    size?: AvatarSize;
    isLoading?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const APAvatar: React.FC<APAvatarProps> = ({author, size, isLoading = false, disabled = false, className = ''}) => {
    let iconSize = 20;
    let containerClass = `shrink-0 items-center justify-center rounded-full overflow-hidden relative z-10 flex bg-black/5 dark:bg-gray-900 ${size === 'lg' || disabled ? '' : 'cursor-pointer'} ${className}`;
    let imageClass = 'z-10 object-cover';
    const [iconUrl, setIconUrl] = useState(author?.icon?.url);
    const navigate = useNavigate();

    useEffect(() => {
        setIconUrl(author?.icon?.url);
    }, [author?.icon?.url]);

    switch (size) {
    case '2xs':
        iconSize = 10;
        containerClass = clsx('size-4', containerClass);
        imageClass = clsx('size-4', imageClass);
        break;
    case 'xs':
        iconSize = 12;
        containerClass = clsx('size-6', containerClass);
        imageClass = clsx('size-6', imageClass);
        break;
    case 'notification':
        iconSize = 16;
        containerClass = clsx('size-9', containerClass);
        imageClass = clsx('size-9', imageClass);
        break;
    case 'sm':
        containerClass = clsx('size-10', containerClass);
        imageClass = clsx('size-10', imageClass);
        break;
    case 'md':
        containerClass = clsx('size-[60px]', containerClass);
        imageClass = clsx('size-[60px]', imageClass);
        break;
    case 'lg':
        containerClass = clsx('size-22', containerClass);
        imageClass = clsx('size-22', imageClass);
        break;
    default:
        containerClass = clsx('size-10', containerClass);
        imageClass = clsx('size-10', imageClass);
        break;
    }

    if (!author || isLoading) {
        return <Skeleton className={imageClass} containerClassName={containerClass} />;
    }

    const handle = author?.handle || getUsername(author as ActorProperties);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/profile/${handle}`);
    };

    const title = `${author?.name} ${handle}`;

    if (iconUrl) {
        return (
            <div
                className={containerClass}
                title={title}
                onClick={size === 'lg' || disabled ? undefined : handleClick}
            >
                <img
                    className={imageClass}
                    referrerPolicy='no-referrer'
                    src={iconUrl}
                    onError={() => setIconUrl(undefined)}
                />
            </div>
        );
    }

    return (
        <div
            className={containerClass}
            title={title}
            onClick={disabled ? undefined : handleClick}
        >
            <LucideIcon.UserRound className='text-gray-600' size={iconSize} strokeWidth={1.5} />
        </div>
    );
};

export default APAvatar;
