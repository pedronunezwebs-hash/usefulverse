const root = document.querySelector('[data-tool="screen-mirroring"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const signal = form.elements.namedItem('signal');
  let peer = null;
  let screenStream = null;
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (className) el.className = className; return el; };
  function setStatus(message, error = false) { status.textContent = message; status.classList.toggle('status--error', error); }
  function stop() {
    if (peer) { peer.ontrack = null; peer.onconnectionstatechange = null; peer.close(); peer = null; }
    for (const track of screenStream?.getTracks() ?? []) track.stop(); screenStream = null;
  }
  function video(label, stream, muted) {
    const wrap = document.createElement('figure'); wrap.className = 'pending-mirror-video';
    const player = document.createElement('video'); player.autoplay = true; player.playsInline = true; player.muted = muted; player.srcObject = stream; player.setAttribute('aria-label', label);
    wrap.append(player, node('figcaption', label)); content.append(wrap);
  }
  function showSignal(text) {
    const localPreview = content.querySelector('.pending-mirror-video');
    if (localPreview) localPreview.remove();
    content.replaceChildren();
    const label = node('label', copy.fields.signalOutput); label.htmlFor = 'screen-mirroring-signal-output';
    const output = node('textarea'); output.id = label.htmlFor; output.readOnly = true; output.rows = 8; output.value = text; output.className = 'pending-mirror-sdp';
    const button = node('button', copy.actions.copy, 'button button--secondary'); button.type = 'button';
    button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(text); setStatus(copy.messages.copied); } catch { setStatus(copy.messages.copyFailed, true); } });
    if (localPreview) content.append(localPreview);
    content.append(label, output, button); result.hidden = false;
  }
  async function gather(peerConnection) {
    if (peerConnection.iceGatheringState === 'complete') return;
    await new Promise((resolve, reject) => {
      const finish = (error) => {
        clearTimeout(timer);
        peerConnection.removeEventListener('icegatheringstatechange', onChange);
        if (error) reject(error); else resolve();
      };
      const onChange = () => { if (peerConnection.iceGatheringState === 'complete') finish(); };
      const timer = setTimeout(() => finish(new Error(copy.messages.connectionUnavailable)), 8000);
      peerConnection.addEventListener('icegatheringstatechange', onChange);
      onChange();
    });
  }
  function attachPeer(connection) {
    connection.ontrack = (event) => { content.querySelectorAll('.pending-mirror-video').forEach((item) => item.remove()); video(copy.fields.remoteScreen, event.streams[0], false); result.hidden = false; };
    connection.onconnectionstatechange = () => { if (connection.connectionState === 'failed' || connection.connectionState === 'disconnected') setStatus(copy.messages.connectionUnavailable, true); };
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); setStatus(copy.messages.working); result.hidden = true;
    try {
      const action = form.elements.namedItem('action').value;
      if (!('RTCPeerConnection' in window)) throw new Error(copy.messages.unsupported);
      if (action === 'share') {
        stop(); content.replaceChildren();
        if (!navigator.mediaDevices?.getDisplayMedia) throw new Error(copy.messages.unsupported);
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        video(copy.fields.localScreen, screenStream, true);
        peer = new RTCPeerConnection({ iceServers: [] }); attachPeer(peer);
        for (const track of screenStream.getTracks()) {
          peer.addTrack(track, screenStream);
          track.addEventListener('ended', () => { stop(); setStatus(copy.messages.sharingStopped); }, { once: true });
        }
        const offer = await peer.createOffer(); await peer.setLocalDescription(offer); await gather(peer);
        showSignal(peer.localDescription.sdp); setStatus(copy.messages.offerReady); return;
      }
      if (action === 'answer') {
        stop(); peer = new RTCPeerConnection({ iceServers: [] }); attachPeer(peer);
        await peer.setRemoteDescription({ type: 'offer', sdp: signal.value.trim() });
        const answer = await peer.createAnswer(); await peer.setLocalDescription(answer); await gather(peer);
        showSignal(peer.localDescription.sdp); setStatus(copy.messages.answerReady); return;
      }
      if (!peer || peer.signalingState !== 'have-local-offer') throw new Error(copy.messages.startFirst);
      await peer.setRemoteDescription({ type: 'answer', sdp: signal.value.trim() }); setStatus(copy.messages.answerApplied); result.hidden = false;
    } catch (error) { stop(); content.replaceChildren(); setStatus(error instanceof Error ? error.message : copy.messages.error, true); result.hidden = false; }
  });
  form.addEventListener('reset', () => queueMicrotask(() => { stop(); content.replaceChildren(); result.hidden = true; setStatus(''); }));
  window.addEventListener('pagehide', stop, { once: true });
}
