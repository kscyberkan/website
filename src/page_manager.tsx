import React, { use, useEffect, type JSX } from 'react'

// 🎯 Page types
import Home from './home/home';
import Video from './home/video/video';

import Schedule from './schedule/schedule';
import FooterMobile from './nav/footer_mobile';

type PageType = "home" | "home_video" | "schedule";

type PageManagerProps = {
    pageState: PageState;
}

const PageComponents: Record<PageType, (props: any) => JSX.Element> = {
    home: Home,
    home_video: Video,
    schedule: Schedule,
}

type PageFunctionType = {
    setPageState: (state: PageState) => void;
}

export const pageFunction: PageFunctionType = {
    setPageState: (state: PageState) => { }
}

type PageState = { page: PageType, props?: any }

export default function PageManager(props: PageManagerProps) {
    const [pageState, setPageState] = React.useState<PageState>(props.pageState);

    useEffect(() => {
        pageFunction.setPageState = setPageState;
    }, []);

    const Page = PageComponents[pageState.page];

    return (
        <>
            <Page {...pageState.props} />
            <FooterMobile />
        </>
    )
}
