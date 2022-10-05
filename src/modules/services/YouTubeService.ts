const youTubePlay = () => {
    const playCode = `const player = document.getElementById("movie_player");
    player.playVideo();`;
    document.documentElement.setAttribute("onreset", playCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    console.log("YouTube video is played!");
};

const youTubePause = () => {
    const pauseCode = `const player = document.getElementById("movie_player");
    player.pauseVideo();`;
    document.documentElement.setAttribute("onreset", pauseCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    console.log("YouTube video is paused!");
};

const youTubeSeek = (videoTime: number) => {
    const seekCode = `const player = document.getElementById("movie_player");
        player.seekTo(${videoTime});`;
    document.documentElement.setAttribute("onreset", seekCode);
    document.documentElement.dispatchEvent(new CustomEvent("reset"));
    document.documentElement.removeAttribute("onreset");
    console.log("YouTube video is seeked!", videoTime);
};

export { youTubePlay, youTubePause, youTubeSeek };
