'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useProfile } from '@/hooks/useProfile';
import { useActivity } from '@/hooks/useActivity';
import { timeAgo } from '@/lib/utils/format';

function getActivityIcon(activity: string): string {
  const lower = activity.toLowerCase();
  if (lower.includes('laporan') && lower.includes('buat')) return 'assignment_add';
  if (lower.includes('status')) return 'assignment_turned_in';
  if (lower.includes('baca') || lower.includes('artikel')) return 'auto_stories';
  if (lower.includes('login') || lower.includes('welcome')) return 'login';
  if (lower.includes('register')) return 'person_add';
  if (lower.includes('security') || lower.includes('key')) return 'security';
  if (lower.includes('update') || lower.includes('edit')) return 'edit';
  return 'notifications';
}

function getActivityColor(activity: string): { bg: string; text: string } {
  const lower = activity.toLowerCase();
  if (lower.includes('laporan') && lower.includes('buat')) return { bg: 'bg-primary-container', text: 'text-primary' };
  if (lower.includes('status')) return { bg: 'bg-secondary-container', text: 'text-secondary' };
  if (lower.includes('baca') || lower.includes('artikel')) return { bg: 'bg-tertiary-container', text: 'text-tertiary' };
  if (lower.includes('login') || lower.includes('welcome')) return { bg: 'bg-primary-container', text: 'text-primary' };
  if (lower.includes('security') || lower.includes('key')) return { bg: 'bg-tertiary-container', text: 'text-tertiary' };
  return { bg: 'bg-primary-container', text: 'text-primary' };
}

interface SecurityItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: string;
}

interface Preference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function ProfilePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { data: profile, loading: profileLoading, error: profileError, updateProfile, updating } = useProfile();
  const { data: activities, loading: activityLoading, error: activityError } = useActivity(5);

  const [preferences, setPreferences] = useState<Preference[]>([
    { id: 'ghost', label: 'Ghost Mode', description: 'Hide your profile from public search.', enabled: true },
    { id: 'encrypted', label: 'Encrypted Metadata', description: 'Strip location from uploaded images.', enabled: true },
    { id: 'autoredact', label: 'Auto-Redact', description: 'Automatically blur faces in reports.', enabled: false },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', nim: '' });

  const securityItems: SecurityItem[] = [
    { id: '2fa', icon: 'vibration', title: 'Two-Factor Auth', description: 'Stronger protection for your account.', status: 'Enabled' },
    { id: 'recovery', icon: 'key', title: 'Recovery Keys', description: 'Last resort for account access.', status: 'Manage Keys' },
    { id: 'sessions', icon: 'devices', title: 'Active Sessions', description: 'Currently logged in on 2 devices.', status: 'Review Activity' },
    { id: 'privacy', icon: 'shield_person', title: 'Privacy Checkup', description: 'Control who can see your reports.', status: 'Start Now ✨' },
  ];

  // WebGL shader effect
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const c = canvas; // TypeScript now knows c is non-null

  function syncSize() {
    const w = c.clientWidth || 1280;
    const h = c.clientHeight || 720;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
  }

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
  if (ro) ro.observe(c);
  syncSize();

  const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    float n1 = snoise(uv * 1.5 + u_time * 0.1);
    float n2 = snoise(uv * 2.0 - u_time * 0.15);
    float n3 = snoise(uv * 3.0 + u_time * 0.05);
    vec3 pink = vec3(1.0, 0.36, 0.54);
    vec3 lavender = vec3(0.91, 0.84, 1.0);
    vec3 babyBlue = vec3(0.65, 0.71, 0.99);
    vec3 peach = vec3(1.0, 0.96, 0.94);
    vec3 color = mix(pink, lavender, uv.x + n1 * 0.2);
    color = mix(color, babyBlue, uv.y + n2 * 0.2);
    color = mix(color, peach, (1.0 - uv.x) * (1.0 - uv.y) + n3 * 0.2);
    gl_FragColor = vec4(color, 1.0);
}`;

    function cs(type: number, src: string) {
      if (!gl) throw new Error('WebGL not available');
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    let animationId: number;
    function render(t: number) {
      if (!ro) syncSize();
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (ro) ro.disconnect();
    };
  }, []);

  const handleEditClick = useCallback(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        email: profile.email || '',
        nim: profile.nim || '',
      });
    }
    setIsEditing(true);
  }, [profile]);

  const handleSaveProfile = useCallback(async () => {
    try {
      await updateProfile({
        name: editForm.name,
        email: editForm.email,
        nim: editForm.nim,
      });
      setIsEditing(false);
    } catch (err) {
      // Error handled by hook
    }
  }, [editForm, updateProfile]);

  const togglePreference = useCallback((id: string) => {
    setPreferences(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden landing-page">
      {/* WebGL Background */}
      <div className="fixed inset-0 w-full h-full z-0" style={{display: 'block'}}>
        <canvas ref={canvasRef} style={{display: 'block', width: '100%', height: '100%'}} />
      </div>

      {/* Main Content */}
      <main className="min-h-screen p-grid-margin relative z-10">
        {/* Top Header */}
        <header className="flex justify-between items-center h-20 mb-8 w-full">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Security & Identity</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your digital presence with peace of mind.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-12 h-12 glass-card rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-primary-container/30 text-primary">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter">
          {/* Personal Information */}
          <section className="md:col-span-4 glass-card p-component-padding rounded-lg flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>badge</span>
              <h2 className="font-headline-sm text-headline-sm">Personal Info</h2>
            </div>
            
            {profileLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                <div className="h-4 bg-white/20 rounded-full w-2/3"></div>
              </div>
            ) : profileError ? (
              <div className="p-4 rounded-lg bg-error-container/20 text-error text-center">
                <span className="material-symbols-outlined text-2xl mb-2">error</span>
                <p className="font-caption">{profileError}</p>
              </div>
            ) : profile ? (
              <div className="space-y-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Display Name</label>
                  <div className="p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md">
                    {profile.name}
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Email Address</label>
                  <div className="p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md">
                    {profile.email}
                  </div>
                </div>
                {profile.nim && (
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">NIM</label>
                    <div className="p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md">
                      {profile.nim}
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleEditClick}
                  className="w-full py-2 border border-primary/40 text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors text-label-md font-label-md"
                >
                  Edit Public Profile
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                <p>No profile data available</p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-outline-variant/20">
              <p className="font-caption text-caption text-on-surface-variant">
                Your identity is only shared with verified responders when you choose to.
              </p>
            </div>
          </section>

          {/* Security Settings */}
<section className="md:col-span-8 glass-card p-component-padding rounded-lg flex flex-col gap-6">
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
      <h2 className="font-headline-sm text-headline-sm">Security & Privacy</h2>
    </div>
    <span className="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-caption font-label-md">Secure</span>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {securityItems.map((item) => (
      <div key={item.id} className="p-4 rounded-xl bg-surface-container-low/50 border border-white/40 flex items-start gap-4 hover:bg-white/40 transition-colors cursor-pointer group">
        <div className="p-3 rounded-xl bg-white/60 group-hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined text-primary">{item.icon}</span>
        </div>
        <div>
          <h3 className="font-body-lg text-body-lg font-bold mb-1">{item.title}</h3>
          <p className="font-caption text-caption text-on-surface-variant">{item.description}</p>
          <span className="text-primary font-label-md text-label-md mt-2 block">{item.status}</span>
        </div>
      </div>
    ))}
  </div>
</section>

          {/* Anonymous Preferences */}
          <section className="md:col-span-6 glass-card p-component-padding rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>visibility_off</span>
              <h2 className="font-headline-sm text-headline-sm">Anonymous Preferences</h2>
            </div>
            <div className="space-y-4">
              {preferences.map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-outline-variant/10">
                  <div>
                    <p className="font-body-md text-body-md font-bold">{pref.label}</p>
                    <p className="font-caption text-caption text-on-surface-variant">{pref.description}</p>
                  </div>
                  <button 
                    onClick={() => togglePreference(pref.id)}
                    className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${pref.enabled ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pref.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Activity History */}
          <section className="md:col-span-6 glass-card p-component-padding rounded-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                <h2 className="font-headline-sm text-headline-sm">Recent Activity</h2>
              </div>
              <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
            </div>
            
            {activityLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                      <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activityError ? (
              <div className="text-center py-4 text-error">
                <span className="material-symbols-outlined text-2xl mb-2">error</span>
                <p className="font-caption">{activityError}</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-3 overflow-y-auto max-h-[280px] pr-2">
                {activities.map((act) => {
                  const colors = getActivityColor(act.activity);
                  return (
                    <div key={act._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/30 transition-colors">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center ${colors.text}`}>
                        <span className="material-symbols-outlined text-[20px]">{getActivityIcon(act.activity)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md font-medium">
                          {act.metadata.title || act.activity}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          {act.metadata.message || act.activity}
                        </p>
                        <p className="text-xs text-outline mt-1 uppercase font-bold">
                          {timeAgo(act.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">history_toggle_off</span>
                <p className="font-caption">No recent activity</p>
              </div>
            )}
          </section>
        </div>

        {/* Support Center - FIX: padding lebih gede, tombol shrink-0, hapus shadow */}
<div className="mt-grid-gutter">
  <div className="glass-card p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
    {/* Blob background */}
    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
    
    <div className="relative z-10">
      <h3 className="font-headline-sm text-headline-sm mb-2">Need to speak with someone?</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
        Our specialized support team is available 24/7 for sensitive cases. Your conversation is always encrypted and anonymous by default.
      </p>
    </div>
    
    <div className="flex gap-4 relative z-10 w-full md:w-auto shrink-0">
      <button className="flex-1 md:flex-none px-5 py-2.5 bg-white text-primary border border-primary/20 rounded-full font-bold text-sm">
        Chat Privately
      </button>
      <button className="flex-1 md:flex-none px-5 py-2.5 bg-primary text-white rounded-full font-bold text-sm">
        Contact Support
      </button>
    </div>
  </div>
</div>

        {/* Footer - FIX: transparan, nggak putih */}
        <footer className="w-full py-section-gap border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-grid-gutter mt-12 relative z-10">
          <div>
            <span className="font-headline-sm text-headline-sm text-on-surface mb-2 block">LINUKS</span>
            <p className="font-caption text-caption text-on-surface-variant opacity-70">© 2024 LINUKS. Supporting your journey with care.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</a>
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Support Center</a>
            <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </footer>
      </main>

      {/* Edit Profile Modal */}
      {isEditing && profile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="glass-card p-8 rounded-2xl w-full max-w-md relative">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-background mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Display Name</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Email Address</label>
                <input 
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">NIM</label>
                <input 
                  type="text"
                  value={editForm.nim}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nim: e.target.value }))}
                  className="w-full p-3 bg-white/20 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 border border-outline-variant/30 rounded-lg font-bold text-on-surface-variant hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={updating}
                  className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
