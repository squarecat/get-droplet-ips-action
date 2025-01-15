## Get the IP addresses for DigitalOcean Droplets with a specific tag

Useful for deploying to every droplet with a certain tag.

```yaml
steps:
  - name: 📫 Fetch deploy IPs for processors
    id: deploy-to-processor    
    uses: squarecat/get-droplet-ips-action@1.0.3
    with:
      digital-ocean-key: ${{ secrets.DO_API_KEY }}     # DigitalOcean API key
      tag: processor                                   # tag to search for
      network-type: public                             # fetch "public" or "private" IPs
```

### Use as a matrix

It's easy to pass the IPs to the next job as a matrix, creating a seperate job for each IP.

```yaml
name: Deploy things
jobs:
  build:
    name: 👷‍♂️ Build
    runs-on: ubuntu-latest    
    outputs:
      server_ips: ${{ steps.deploy-to-processor.outputs.server_ips || 'no-server-ip-found' }}    
    steps:
      - name: 📫 Fetch deploy IPs for processors
        id: deploy-to-processor
        if: ${{ github.event.inputs.app == 'processor' }}
        uses: squarecat/get-droplet-ips-action@1.0.3
        with:
          digital-ocean-key: ${{ secrets.DO_API_KEY }}
          tag: processor
          
  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: [build]
    strategy:
      matrix:
        server_ip: ${{fromJson(needs.build.outputs.server_ips)}}    
    steps:
      - name: Your deploy steps...
      ...
```

Results in the following jobs:

![CleanShot 2025-01-15 at 13 46 22@2x](https://github.com/user-attachments/assets/8bfe8eaf-d453-4fdd-a739-86eb9ec9b848)
