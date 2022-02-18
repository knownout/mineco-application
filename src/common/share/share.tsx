import React from "react";
import "./share.scss";

/**
 * Function for transforming entry of sourcesList
 * to ShareButton props
 * @param source sourcesList entry
 */
const processSource = (source: (string | number[])[]) => ({
    link: `https://${ source[0] }`,
    size: `width=${ source[1][0] },height=${ source[1][1] }`,
    icon: `/public/icons/${ source[2] }.svg`
});

/**
 * List of [share links with placeholders, window width and height, icon]
 */
const sourcesList = {
    "vk": [ "vk.com/share.php?url={link}&title={title}&description=&image=", [ 526, 460 ], "vk" ],
    "twitter": [ "twitter.com/intent/tweet?text={title}%0A{link}", [ 526, 460 ], "twitter" ],
    "facebook": [ "www.facebook.com/sharer/sharer.php?u={link}", [ 526, 460 ], "facebook-color" ]
};

interface ShareButtonProps {
    // Share link with {title} and {url} placeholders
    link: string;


    // Material title
    title: string;

    // Icon path (src)
    icon: string;

    // Popup window size
    size: string;


    // Link to material
    current: string;
}

interface ShareComponentProps {
    // Which buttons display
    sources: Partial<{ [key in keyof typeof sourcesList]: boolean }>;

    // Material title
    title: string;

    // Link to material
    current: string;
}

/**
 * Component for creating single share button
 * @internal
 */
const ShareButton: React.FC<ShareButtonProps> = React.memo(({ icon, link, title, size, current }) => {
    const processed = link.replace("{link}", current).replace("{title}", title);
    const clickHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        window.open(processed, `Поделиться: ${ title }`, `${ size },left=100,top=100`);
    };

    return <a href={ processed } className="share-button ui grid center" onClick={ clickHandler }>
        <img src={ icon } alt={ title } />
    </a>;
});

export function ShareComponent (props: ShareComponentProps) {
    const entries = Object.entries(props.sources).filter(entry => entry[1]);

    return <div className="share-component ui flex row gap center-ai">
        <span className="share-title ui opacity-85">Поделиться</span>
        <div className="buttons-holder ui flex row gap-5">
            { entries.map(([ key ], index) =>
                <ShareButton { ...processSource(sourcesList[key as keyof typeof sourcesList]) } title={ props.title }
                             key={ index } current={ props.current } />) }
        </div>
    </div>;
}
