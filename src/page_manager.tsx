import React, { useEffect, type JSX } from 'react';

// 🎯 Page imports
import HomePage from './home';
import VideoPage from './video';

// 📋 Page types
type PageType = 'home' | 'video';

type PageState = { page: PageType; props?: any };

type PageManagerProps = {
    pageState: PageState;
};

// 🗺️ Page registry
const PageComponents: Record<PageType, (props: any) => JSX.Element> = {
    home: HomePage,
    video: VideoPage,
};

// 🌐 Global page function (เรียกจากที่ไหนก็ได้)
type PageFunctionType = {
    setPageState: (state: PageState) => void;
};

export const pageFunction: PageFunctionType = {
    setPageState: () => {},
};

// ✅ Helper shortcuts
export const goTo = {
    home: () => pageFunction.setPageState({ page: 'home' }),
    video: (props?: any) => pageFunction.setPageState({ page: 'video', props }),
};

export default function PageManager(props: PageManagerProps) {
    const [pageState, setPageState] = React.useState<PageState>(props.pageState);

    useEffect(() => {
        pageFunction.setPageState = setPageState;
    }, []);

    const Page = PageComponents[pageState.page];

    return <Page {...pageState.props} />;
}
