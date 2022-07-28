const netflixPlay = () => {
    const playCode = `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    player.play();`;
    document.documentElement.setAttribute("onreset", playCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    console.log("Video is played!");
};

const netflixPause = () => {
    const pauseCode = `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    player.pause();`;
    document.documentElement.setAttribute("onreset", pauseCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    console.log("Video is paused!");
};

const netflixSeek = (videoTime: number) => {
    const time = videoTime * 1000;
    const seekCode = `const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
        const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
        player.seek(${time});`;
    document.documentElement.setAttribute("onreset", seekCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    document.documentElement.removeAttribute("onreset");
    console.log("Video is seeked!", videoTime);
};

export { netflixPlay, netflixPause, netflixSeek };
