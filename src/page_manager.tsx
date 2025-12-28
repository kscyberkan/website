import React, { use, useEffect, type JSX } from 'react'

// 🎯 Page types
import Home from './home/home';
import Video from './home/video/video';

import TimeTable from './time_table/time_table';

type PageType = "home" | "home_video" | "time_table";

type PageManagerProps = {
    pageState: PageState;
}

const PageComponents: Record<PageType, (props: any) => JSX.Element> = {
    home: Home,
    home_video: Video,
    time_table: TimeTable,
}

type PageFunctionType = {
    setPageState: (state: PageState) => void;
}

export const pageFunction: PageFunctionType = {
    setPageState: (state: PageState) => { }
}

type PageState = { page: "home" | "home_video" | "time_table", props?: any }

export default function PageManager(props: PageManagerProps) {
    const [pageState, setPageState] = React.useState<PageState>(props.pageState);

    useEffect(() => {
        pageFunction.setPageState = setPageState;
    }, []);

    const Page = PageComponents[pageState.page];

    return (
        <Page {...pageState.props} />
    )
}
